import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Store, TriangleAlert, BadgeCheck, MapPin, Clock, ShoppingBasket, ShieldCheck, Megaphone } from "lucide-react";
import { toast } from "sonner";
import mapImg from "@/assets/map.jpg";
import { pins, products, brl, SERVICE_FEE, type PinType, type Product } from "@/lib/data";
import { useOffline } from "@/components/AppShell";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SeedUna — Mapa rural e alimentos locais" },
      { name: "description", content: "Encontre produtores, comércios e alertas de estradas rurais. Compre alimentos frescos e evite o desperdício." },
      { property: "og:title", content: "SeedUna — Mapa rural e alimentos locais" },
      { property: "og:description", content: "Mapa interativo e ofertas contra o desperdício direto do produtor." },
    ],
  }),
  component: Index,
});

const pinStyle: Record<PinType, { icon: typeof Home; cls: string; label: string }> = {
  produtor: { icon: Home, cls: "bg-primary text-primary-foreground", label: "Produtores" },
  comercio: { icon: Store, cls: "bg-leaf text-primary-foreground", label: "Comércios" },
  alerta: { icon: TriangleAlert, cls: "bg-accent text-accent-foreground", label: "Alertas de estrada" },
};

function Index() {
  const [filter, setFilter] = useState<PinType | "todos">("todos");
  const [sel, setSel] = useState<(typeof pins)[number] | null>(null);
  const [buy, setBuy] = useState<Product | null>(null);
  const shown = pins.filter((p) => filter === "todos" || p.type === filter);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Mapa da nossa região</h1>
        <p className="mt-1 text-muted-foreground">Toque nos pontos para ver produtores, comércios e estradas.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["todos", "produtor", "comercio", "alerta"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 font-semibold ${filter === f ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>
              {f === "todos" ? "Todos" : pinStyle[f].label}
            </button>
          ))}
        </div>
        <div className="relative mt-4 overflow-hidden rounded-2xl border shadow-soft">
          <img src={mapImg} alt="Mapa ilustrado da região rural" width={1280} height={800} className="aspect-[4/3] w-full object-cover md:aspect-[16/9]" />
          {shown.map((p) => {
            const S = pinStyle[p.type];
            return (
              <button key={p.id} onClick={() => setSel(p)} aria-label={p.name}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card p-2 shadow-lg transition hover:scale-110 ${S.cls} ${sel?.id === p.id ? "scale-125" : ""}`}>
                <S.icon className="h-5 w-5" />
              </button>
            );
          })}
          {sel && (
            <div className="absolute inset-x-3 bottom-3 rounded-xl bg-card p-4 shadow-lg md:left-auto md:w-80">
              <p className="font-display text-lg font-bold">{sel.name}</p>
              <p className="text-muted-foreground">{sel.info}</p>
              {sel.type === "alerta" && <p className="mt-1 text-xs text-muted-foreground">Atualizado pela comunidade</p>}
              <button onClick={() => setSel(null)} className="mt-2 text-sm font-bold text-leaf">Fechar</button>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">Colheita do Dia</span>
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">Evite o Desperdício</h2>
        </div>
        <p className="mt-1 text-muted-foreground">Descontos que aumentam conforme o alimento se aproxima do fim da validade.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.id} p={p} onBuy={() => setBuy(p)} />)}
        </div>
      </section>

      <aside className="flex items-center gap-4 rounded-2xl border border-dashed bg-secondary p-5">
        <Megaphone className="h-8 w-8 shrink-0 text-leaf" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Patrocinado pelo Comércio Local</p>
          <p className="font-display text-lg font-bold">Mercadinho Central — 10% off em sementes e adubo esta semana</p>
        </div>
      </aside>

      <Checkout product={buy} onClose={() => setBuy(null)} />
    </div>
  );
}

function ProductCard({ p, onBuy }: { p: Product; onBuy: () => void }) {
  const off = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className="relative">
        <img src={p.img} alt={p.name} loading="lazy" width={944} height={704} className="aspect-[4/3] w-full object-cover" />
        {p.urgent && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
            <Clock className="h-4 w-4" />{p.urgent}
          </span>
        )}
        {off > 0 && <span className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-sm font-bold text-destructive-foreground">-{off}%</span>}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-xl font-bold">{p.name}</h3>
        <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{p.producer} • {p.km.toLocaleString("pt-BR")} km</p>
        {p.verified && <p className="flex items-center gap-1 text-sm font-bold text-leaf"><BadgeCheck className="h-4 w-4" />Comércio Local Verificado</p>}
        <div className="flex items-end justify-between pt-1">
          <div>
            {p.old && <p className="text-sm text-muted-foreground line-through">{brl(p.old)}</p>}
            <p className="font-display text-2xl font-extrabold text-primary">{brl(p.price)}</p>
          </div>
          <button onClick={onBuy} className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-bold text-accent-foreground hover:brightness-95">
            <ShoppingBasket className="h-5 w-5" />Comprar
          </button>
        </div>
      </div>
    </article>
  );
}

function Checkout({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"retirada" | "entrega">("retirada");
  const offline = useOffline();
  if (!product) return null;
  const sub = product.price * qty;
  const delivery = mode === "entrega" ? 6 : 0;
  const fee = Math.round(sub * SERVICE_FEE * 100) / 100;
  const total = sub + fee + delivery;
  return (
    <Dialog open onOpenChange={(o) => { if (!o) { onClose(); setQty(1); } }}>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display text-2xl">Finalizar compra</DialogTitle></DialogHeader>
        <p className="font-bold">{product.name}</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-12 w-12 rounded-xl border text-2xl font-bold">−</button>
          <span className="w-10 text-center text-2xl font-bold">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="h-12 w-12 rounded-xl border text-2xl font-bold">+</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(["retirada", "entrega"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-xl border p-3 font-semibold ${mode === m ? "border-primary bg-secondary" : ""}`}>
              {m === "retirada" ? "Retirar no ponto de apoio" : "Entrega (+R$ 6)"}
            </button>
          ))}
        </div>
        <dl className="space-y-1 rounded-xl bg-muted p-4">
          <div className="flex justify-between"><dt>Produtos</dt><dd>{brl(sub)}</dd></div>
          <div className="flex justify-between"><dt>Taxa de serviço (5%)</dt><dd>{brl(fee)}</dd></div>
          {delivery > 0 && <div className="flex justify-between"><dt>Entrega</dt><dd>{brl(delivery)}</dd></div>}
          <div className="flex justify-between border-t pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{brl(total)}</dd></div>
        </dl>
        <p className="flex items-center gap-2 text-sm text-leaf"><ShieldCheck className="h-5 w-5" />Garantia SeedUna: dinheiro de volta se não receber.</p>
        <button onClick={() => { toast.success(offline ? "Pedido salvo no aparelho. Será enviado quando houver sinal." : "Pedido confirmado! O produtor já foi avisado."); onClose(); setQty(1); }}
          className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-primary-foreground">Confirmar pedido • {brl(total)}</button>
      </DialogContent>
    </Dialog>
  );
}
