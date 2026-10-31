import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Sprout, Users, Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth", search: { redirect: location.pathname } });
  },
  component: Gate,
});

function Gate() {
  const { ready, role } = useAuth();
  if (!ready) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!role) return <ChooseRole />;
  return <Outlet />;
}

const options: { role: Role; icon: typeof Sprout; title: string; desc: string }[] = [
  { role: "produtor", icon: Sprout, title: "Sou Produtor", desc: "Vendo minha colheita e contrato ajudantes" },
  { role: "trabalhador", icon: Users, title: "Sou Trabalhador", desc: "Procuro trabalho no campo e compro alimentos" },
  { role: "prefeitura", icon: Landmark, title: "Sou da Prefeitura", desc: "Acompanho dados, desperdício e estradas" },
];

function ChooseRole() {
  const { refresh } = useAuth();
  const [busy, setBusy] = useState<Role | null>(null);
  async function pick(role: Role) {
    setBusy(role);
    const { error } = await supabase.rpc("choose_role", { _role: role });
    setBusy(null);
    if (error) { toast.error("Não foi possível salvar. Tente de novo."); return; }
    await refresh();
  }
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl font-extrabold text-primary">Quem é você?</h1>
      <p className="text-muted-foreground">Escolha uma vez. Isso define o que aparece para você no SeedUna.</p>
      <div className="grid gap-4">
        {options.map((o) => (
          <button key={o.role} disabled={!!busy} onClick={() => pick(o.role)}
            className="flex items-center gap-4 rounded-2xl border-2 bg-card p-5 text-left shadow-soft transition hover:border-primary disabled:opacity-60">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              {busy === o.role ? <Loader2 className="h-7 w-7 animate-spin" /> : <o.icon className="h-8 w-8" />}
            </span>
            <span>
              <span className="block font-display text-xl font-bold">{o.title}</span>
              <span className="text-muted-foreground">{o.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
