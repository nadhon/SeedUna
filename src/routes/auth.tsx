import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";

type Search = { redirect?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const v = s["redirect"]; const r = typeof v === "string" && v.startsWith("/") && !v.startsWith("//") ? v : undefined;
    return { redirect: r };
  },
  head: () => ({
    meta: [
      { title: "Entrar — SeedUna" },
      { name: "description", content: "Entre ou crie sua conta no SeedUna com e-mail ou Google." },
      { property: "og:title", content: "Entrar — SeedUna" },
      { property: "og:description", content: "Acesse sua conta de produtor, trabalhador ou prefeitura." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<"entrar" | "cadastrar">("entrar");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (ready && user) navigate({ to: redirect ?? "/perfil", replace: true });
  }, [ready, user, redirect, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) toast.error("E-mail ou senha incorretos.");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password: senha,
        options: { emailRedirectTo: window.location.origin + "/auth", data: { nome } },
      });
      if (error) toast.error(error.message);
      else { toast.success("Conta criada! Confira seu e-mail para confirmar o cadastro."); setMode("entrar"); }
    }
    setBusy(false);
  }

  async function google() {
    if (redirect) sessionStorage.setItem("seeduna_after_login", redirect);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) toast.error("Não foi possível entrar com o Google.");
  }

  useEffect(() => {
    if (ready && user) {
      const saved = sessionStorage.getItem("seeduna_after_login");
      if (saved) { sessionStorage.removeItem("seeduna_after_login"); navigate({ to: saved, replace: true }); }
    }
  }, [ready, user, navigate]);

  const input = "mt-1 w-full rounded-xl border-2 bg-background px-4 py-3 text-lg outline-none focus:border-primary";
  return (
    <div className="mx-auto max-w-md space-y-5 py-6">
      <h1 className="text-3xl font-extrabold text-primary">{mode === "entrar" ? "Entrar" : "Criar conta"}</h1>
      <button onClick={google} className="flex w-full items-center justify-center gap-3 rounded-xl border-2 bg-card py-3 text-lg font-bold hover:border-primary">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.3-4.7 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>
        Continuar com Google
      </button>
      <div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
      <form onSubmit={submit} className="space-y-4">
        {mode === "cadastrar" && (
          <label className="block"><span className="font-semibold">Seu nome</span>
            <input required value={nome} onChange={(e) => setNome(e.target.value)} className={input} /></label>
        )}
        <label className="block"><span className="font-semibold">E-mail</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} /></label>
        <label className="block"><span className="font-semibold">Senha</span>
          <input required type="password" minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} className={input} /></label>
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground disabled:opacity-60">
          {busy && <Loader2 className="h-5 w-5 animate-spin" />}{mode === "entrar" ? "Entrar" : "Criar conta"}
        </button>
      </form>
      <button onClick={() => setMode(mode === "entrar" ? "cadastrar" : "entrar")} className="w-full text-center font-bold text-leaf">
        {mode === "entrar" ? "Ainda não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
      </button>
    </div>
  );
}
