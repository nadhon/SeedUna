import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, Loader2, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { roleLabel } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — SeedUna" },
      { name: "description", content: "Edite sua foto, nome e o nome do seu sítio, fazenda, engenho ou organização." },
      { property: "og:title", content: "Meu perfil — SeedUna" },
      { property: "og:description", content: "Seus dados no SeedUna." },
    ],
  }),
  component: Perfil,
});

function Perfil() {
  const { user, profile, role, avatarSrc, refresh } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [org, setOrg] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setNome(profile?.nome ?? ""); setOrg(profile?.organizacao ?? ""); }, [profile]);

  const orgLabel = role === "prefeitura" ? "Órgão / secretaria" : role === "trabalhador" ? "Onde você mora ou trabalha" : "Nome do sítio, fazenda ou engenho";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, nome, organizacao: org, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) { toast.error("Não foi possível salvar."); return; }
    toast.success("Perfil salvo!");
    refresh();
  }

  async function upload(file: File) {
    if (!user) return;
    setUploading(true);
    const path = `${user.id}/avatar-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (!error) await supabase.from("profiles").upsert({ id: user.id, avatar_url: path });
    setUploading(false);
    if (error) { toast.error("Não foi possível enviar a foto."); return; }
    toast.success("Foto atualizada!");
    refresh();
  }

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const input = "mt-1 w-full rounded-xl border-2 bg-background px-4 py-3 text-lg outline-none focus:border-primary";
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-3xl font-extrabold text-primary">Meu perfil</h1>
      <div className="flex items-center gap-4">
        <label className="relative cursor-pointer">
          {avatarSrc
            ? <img src={avatarSrc} alt="Sua foto" className="h-24 w-24 rounded-full border-4 border-card object-cover shadow-soft" />
            : <span className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-primary"><UserRound className="h-12 w-12" /></span>}
          <span className="absolute bottom-0 right-0 rounded-full bg-accent p-2 text-accent-foreground shadow">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </span>
          <input type="file" accept="image/*" className="sr-only" aria-label="Trocar foto"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        <div>
          <p className="font-display text-xl font-bold">{profile?.nome || "Sem nome"}</p>
          <p className="text-muted-foreground">{user?.email}</p>
          {role && <span className="mt-1 inline-block rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">{roleLabel[role]}</span>}
        </div>
      </div>
      <form onSubmit={save} className="space-y-4">
        <label className="block"><span className="font-semibold">Nome de usuário</span>
          <input required value={nome} onChange={(e) => setNome(e.target.value)} className={input} /></label>
        <label className="block"><span className="font-semibold">{orgLabel}</span>
          <input value={org} onChange={(e) => setOrg(e.target.value)} className={input} /></label>
        <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground disabled:opacity-60">
          {saving && <Loader2 className="h-5 w-5 animate-spin" />}Salvar
        </button>
      </form>
      <button onClick={sair} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 py-3 font-bold text-muted-foreground">
        <LogOut className="h-5 w-5" />Sair da conta
      </button>
    </div>
  );
}
