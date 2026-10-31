import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/roles";

export type Profile = { nome: string; organizacao: string; avatar_url: string | null };

type AuthState = {
  ready: boolean;
  user: User | null;
  profile: Profile | null;
  role: Role | null;
  avatarSrc: string | null;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthState>({
  ready: false, user: null, profile: null, role: null, avatarSrc: null, refresh: async () => {},
});
export const useAuth = () => useContext(Ctx);

async function resolveAvatar(path: string | null) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, "refresh">>({
    ready: false, user: null, profile: null, role: null, avatarSrc: null,
  });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setState({ ready: true, user: null, profile: null, role: null, avatarSrc: null });
      return;
    }
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("nome, organizacao, avatar_url").eq("id", user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", user.id),
    ]);
    const avatarSrc = await resolveAvatar(profile?.avatar_url ?? null);
    setState({ ready: true, user, profile: profile ?? null, role: (roles?.[0]?.role as Role) ?? null, avatarSrc });
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load();
    });
    return () => sub.subscription.unsubscribe();
  }, [load]);

  return <Ctx.Provider value={{ ...state, refresh: load }}>{children}</Ctx.Provider>;
}
