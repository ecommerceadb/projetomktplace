import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge, MetricCard } from "@/components/ui-panels";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/central-alertas")({
  head: () => ({ meta: [{ title: "Central de Alertas — Operações ADB" }] }),
  component: CentralAlertas,
});

type Alerta = { tipo: string; mk: string; cat: string; prod: string; sku: string; data: string; impacto: "Alto" | "Médio" | "Baixo"; sev: "Críticos" | "Atenção" | "Informativos" };

const alertas: Alerta[] = [
  { tipo: "Ruptura de Estoque", mk: "Mercado Livre", cat: "Estoque", prod: "Castanha de Caju 100g", sku: "CJU100", data: "23/05/2025 08:45", impacto: "Alto", sev: "Críticos" },
  { tipo: "Estoque Crítico", mk: "Magalu", cat: "Estoque", prod: "Mix de Castanhas 100g", sku: "MC100", data: "23/05/2025 08:30", impacto: "Alto", sev: "Críticos" },
  { tipo: "Queda de Conversão", mk: "Magalu", cat: "Performance", prod: "Cookies Castanha 30g", sku: "CCK30", data: "23/05/2025 07:50", impacto: "Médio", sev: "Atenção" },
  { tipo: "Perda de Buy Box", mk: "Mercado Livre", cat: "Concorrência", prod: "Kit Presente 3 Produtos", sku: "KIT03", data: "23/05/2025 07:20", impacto: "Alto", sev: "Críticos" },
  { tipo: "Anúncio Pausado", mk: "Mercado Livre", cat: "Anúncio", prod: "Ecobag Turma da Mônica", sku: "ECOBAG-MG", data: "23/05/2025 06:40", impacto: "Alto", sev: "Atenção" },
  { tipo: "Preço Acima da Média", mk: "Mercado Livre", cat: "Concorrência", prod: "Mel Silvestre 300g", sku: "MEL300", data: "23/05/2025 06:15", impacto: "Médio", sev: "Atenção" },
  { tipo: "Falha de Importação", mk: "Magalu", cat: "Dados", prod: "Vendas_Magalu_23052025.xlsx", sku: "", data: "23/05/2025 05:30", impacto: "Baixo", sev: "Informativos" },
  { tipo: "Oportunidade SEO", mk: "Mercado Livre", cat: "SEO", prod: "Caneca Cordel", sku: "CANC-COR", data: "23/05/2025 05:10", impacto: "Baixo", sev: "Informativos" },
];

const impactoVariant = { Alto: "danger" as const, Médio: "warning" as const, Baixo: "muted" as const };

function CentralAlertas() {
  const [filter, setFilter] = useState<"Todos" | Alerta["sev"]>("Todos");
  const filtered = filter === "Todos" ? alertas : alertas.filter((a) => a.sev === filter);

  return (
    <>
      <TopBar title="Central de Alertas" subtitle="Acompanhe e resolva rapidamente os principais pontos de atenção da sua operação." />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard label="Total de Alertas" value="32" hint="alertas ativos" icon={<AlertTriangle className="size-4" />} iconColor="bg-danger/15 text-danger" />
        <MetricCard label="Críticos" value="8" hint="ação imediata" icon={<AlertCircle className="size-4" />} iconColor="bg-danger/15 text-danger" />
        <MetricCard label="Atenção" value="16" hint="acompanhar" icon={<AlertTriangle className="size-4" />} iconColor="bg-warning/20 text-warning-foreground" />
        <MetricCard label="Informativos" value="8" hint="monitorar" icon={<Info className="size-4" />} iconColor="bg-info/15 text-info" />
        <MetricCard label="Resolvidos (7 dias)" value="24" hint="alertas" icon={<CheckCircle2 className="size-4" />} iconColor="bg-success/15 text-success" />
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
            {(["Todos", "Críticos", "Atenção", "Informativos"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1.5 font-medium ${filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Ordenar por:</span>
            <select className="rounded-md border border-border bg-card px-2 py-1.5 text-xs">
              <option>Mais recentes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2">Alerta</th>
                <th className="py-2">Marketplace</th>
                <th className="py-2">Tipo</th>
                <th className="py-2">Produto / SKU</th>
                <th className="py-2">Data</th>
                <th className="py-2">Impacto</th>
                <th className="py-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium flex items-center gap-2">
                    <AlertTriangle className={`size-4 ${a.sev === "Críticos" ? "text-danger" : a.sev === "Atenção" ? "text-warning-foreground" : "text-info"}`} />
                    {a.tipo}
                  </td>
                  <td className="py-3">{a.mk}</td>
                  <td className="py-3 text-muted-foreground">{a.cat}</td>
                  <td className="py-3">
                    <div className="font-medium">{a.prod}</div>
                    {a.sku && <div className="text-xs text-muted-foreground">{a.sku}</div>}
                  </td>
                  <td className="py-3 text-muted-foreground">{a.data}</td>
                  <td className="py-3"><Badge variant={impactoVariant[a.impacto]}>{a.impacto}</Badge></td>
                  <td className="py-3"><button className="text-xs rounded-md border border-border px-3 py-1 hover:bg-accent">Ver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Mostrando {filtered.length} de {alertas.length} alertas</span>
          <button className="text-info font-semibold">Ver histórico completo →</button>
        </div>
      </Panel>
    </>
  );
}
