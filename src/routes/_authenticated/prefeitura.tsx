import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/RequireRole";
import { Users, Banknote, Leaf, TrendingUp, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { brl, regions, roads } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/prefeitura")({
  head: () => ({
    meta: [
      { title: "Painel da Prefeitura — SeedUna" },
      { name: "description", content: "Indicadores de produção, vendas locais, desperdício evitado e estradas rurais críticas." },
      { property: "og:title", content: "Painel da Prefeitura — SeedUna" },
      { property: "og:description", content: "Inteligência de dados rurais para gestão pública." },
    ],
  }),
  component: () => <RequireRole page="/prefeitura"><Prefeitura /></RequireRole>,
});

const kpis = [
  { label: "Produtores mapeados", value: "1.248", icon: Users },
  { label: "Vendas locais (mês)", value: brl(486300), icon: Banknote },
  { label: "Alimento salvo", value: "38,4 t", icon: Leaf },
  { label: "Receita da plataforma", value: brl(24315), icon: TrendingUp },
];

const levelCls: Record<string, string> = {
  Crítico: "bg-destructive text-destructive-foreground",
  Alto: "bg-warning text-primary-foreground",
  Médio: "bg-accent text-accent-foreground",
  Baixo: "bg-secondary text-primary",
};

function exportCsv() {
  const rows = [["Indicador", "Valor"], ...kpis.map((k) => [k.label, k.value]), [], ["Região", "Toneladas"], ...regions.map((r) => [r.name, String(r.toneladas)]), [], ["Estrada", "Região", "Problema", "Relatos", "Nível"], ...roads.map((r) => [r.name, r.region, r.issue, String(r.reports), r.level])];
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv" }));
  a.download = "relatorio-seeduna-outubro-2026.csv";
  a.click();
  toast.success("Relatório exportado!");
}

function Prefeitura() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Painel da Prefeitura</h1>
          <p className="text-muted-foreground">Outubro de 2026</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 font-bold text-accent-foreground"><Download className="h-5 w-5" />Exportar CSV</button>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border-2 border-primary px-4 py-3 font-bold text-primary"><Download className="h-5 w-5" />PDF</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border bg-card p-4 shadow-soft">
            <k.icon className="h-7 w-7 text-leaf" />
            <p className="mt-2 font-display text-2xl font-extrabold md:text-3xl">{k.value}</p>
            <p className="text-sm text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="text-xl font-bold">Produção por micro-região (t)</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={regions}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="toneladas" fill="var(--leaf)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="text-xl font-bold">Estradas rurais mais críticas</h2>
          <ul className="mt-4 divide-y">
            {roads.map((r) => (
              <li key={r.name} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.region} • {r.issue} • {r.reports} relatos</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${levelCls[r.level]}`}>{r.level}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
