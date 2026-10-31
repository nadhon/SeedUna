import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/RequireRole";
import { useState } from "react";
import { MapPin, CalendarDays, Banknote, Hand } from "lucide-react";
import { toast } from "sonner";
import { jobs } from "@/lib/data";
import { useOffline } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/mural")({
  head: () => ({
    meta: [
      { title: "Mural de Trabalho Rural — SeedUna" },
      { name: "description", content: "Vagas de colheita, frete rural e manutenção perto de você." },
      { property: "og:title", content: "Mural de Trabalho Rural — SeedUna" },
      { property: "og:description", content: "Oportunidades de trabalho no campo da sua região." },
    ],
  }),
  component: () => <RequireRole page="/mural"><Mural /></RequireRole>,
});

const kinds = ["Todas", "Colheita", "Frete", "Manutenção", "Ordenha"];

function Mural() {
  const [k, setK] = useState("Todas");
  const [applied, setApplied] = useState<number[]>([]);
  const offline = useOffline();
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Mural de Trabalho</h1>
      <p className="text-muted-foreground">Produtores precisando de ajuda perto de você.</p>
      <div className="flex flex-wrap gap-2">
        {kinds.map((x) => (
          <button key={x} onClick={() => setK(x)} className={`rounded-full border px-4 py-2 font-semibold ${k === x ? "border-primary bg-primary text-primary-foreground" : "bg-card"}`}>{x}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.filter((j) => k === "Todas" || j.kind === k).map((j) => {
          const done = applied.includes(j.id);
          return (
            <article key={j.id} className="rounded-2xl border bg-card p-5 shadow-soft">
              <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">{j.kind}</span>
              <h2 className="mt-3 text-xl font-bold">{j.title}</h2>
              <p className="text-muted-foreground">{j.who}</p>
              <ul className="mt-3 space-y-1">
                <li className="flex items-center gap-2"><MapPin className="h-5 w-5 text-leaf" />{j.where}</li>
                <li className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-leaf" />{j.when}</li>
                <li className="flex items-center gap-2 font-bold"><Banknote className="h-5 w-5 text-leaf" />{j.pay}</li>
              </ul>
              <button disabled={done} onClick={() => { setApplied([...applied, j.id]); toast.success(offline ? "Interesse salvo no aparelho." : "O produtor vai entrar em contato!"); }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-bold text-accent-foreground disabled:bg-muted disabled:text-muted-foreground">
                <Hand className="h-5 w-5" />{done ? "Interesse enviado" : "Quero esse trabalho"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
