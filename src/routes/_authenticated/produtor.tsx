import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Wheat, Users, TriangleAlert, Wallet, Leaf } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/lib/data";
import { useOffline } from "@/components/AppShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/produtor")({
  head: () => ({
    meta: [
      { title: "Painel do Produtor — SeedUna" },
      { name: "description", content: "Cadastre sua colheita, peça ajudantes e avise sobre a estrada em poucos toques." },
      { property: "og:title", content: "Painel do Produtor — SeedUna" },
      { property: "og:description", content: "Painel simples para o produtor rural." },
    ],
  }),
  component: () => <RequireRole page="/produtor"><Produtor /></RequireRole>,
});

const actions = [
  { key: "safra", icon: Wheat, title: "Vender minha colheita", desc: "Cadastre o que sobrou", fields: ["O que você colheu?", "Quantos quilos?", "Preço (R$)"] },
  { key: "mao", icon: Users, title: "Preciso de ajudantes", desc: "Peça diaristas", fields: ["Que serviço?", "Quantas pessoas?", "Pagamento por dia (R$)"] },
  { key: "estrada", icon: TriangleAlert, title: "Avisar sobre a estrada", desc: "Barro, buraco, ponte", fields: ["Nome da estrada", "O que aconteceu?"] },
];

function Produtor() {
  const [open, setOpen] = useState<(typeof actions)[number] | null>(null);
  const offline = useOffline();
  const { profile } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">Bom dia,</p>
        <h1 className="text-3xl font-extrabold text-primary md:text-4xl">{profile?.nome || "Produtor"} 👋</h1>
        <p className="text-muted-foreground">{profile?.organizacao || "Complete seu perfil"}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-hero p-5 text-primary-foreground shadow-soft">
          <Wallet className="h-8 w-8" />
          <p className="mt-2 opacity-90">Vendido em outubro</p>
          <p className="font-display text-4xl font-extrabold">{brl(3480)}</p>
          <p className="text-sm opacity-90">+18% que setembro</p>
        </div>
        <div className="rounded-2xl bg-accent p-5 text-accent-foreground shadow-soft">
          <Leaf className="h-8 w-8" />
          <p className="mt-2">Alimento salvo do desperdício</p>
          <p className="font-display text-4xl font-extrabold">412 kg</p>
          <p className="text-sm">Isso alimenta cerca de 80 famílias</p>
        </div>
      </div>
      <h2 className="text-2xl font-extrabold">O que você quer fazer?</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((a, i) => (
          <button key={a.key} onClick={() => setOpen(a)} className="flex items-center gap-4 rounded-2xl border-2 bg-card p-5 text-left shadow-soft transition hover:border-primary">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"><a.icon className="h-9 w-9" /></span>
            <span>
              <span className="text-sm font-bold text-muted-foreground">Passo {i + 1}</span>
              <span className="block font-display text-xl font-bold">{a.title}</span>
              <span className="text-muted-foreground">{a.desc}</span>
            </span>
          </button>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display text-2xl">{open?.title}</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success(offline ? "Salvo no aparelho! Enviaremos quando houver sinal." : "Pronto! Publicado com sucesso."); setOpen(null); }}>
            {open?.fields.map((f) => (
              <label key={f} className="block">
                <span className="font-semibold">{f}</span>
                <input required className="mt-1 w-full rounded-xl border-2 bg-background px-4 py-3 text-lg outline-none focus:border-primary" />
              </label>
            ))}
            <button className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground">Enviar</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
