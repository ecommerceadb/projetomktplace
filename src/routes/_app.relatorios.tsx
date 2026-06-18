import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel } from "@/components/ui-panels";
import { FileText, FileSpreadsheet, Activity, Target, Search, Download, Sparkles, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — Operações ADB" }] }),
  component: Relatorios,
});

const tipos = [
  { t: "Relatório Executivo", d: "Visão geral completa da operação", i: FileText, c: "text-info bg-info/10" },
  { t: "Relatório de Estoque", d: "Análise completa do estoque", i: FileSpreadsheet, c: "text-success bg-success/10" },
  { t: "Relatório de Performance", d: "Resultados e indicadores", i: Activity, c: "text-brand-navy bg-brand-navy/10" },
  { t: "Relatório de Concorrência", d: "Análise de mercado e competidores", i: Target, c: "text-danger bg-danger/10" },
  { t: "Relatório de SEO", d: "Análise de SEO dos anúncios", i: Search, c: "text-brand-orange bg-brand-orange/10" },
];

const gerados = [
  { n: "Relatório Executivo - 23/05/2025", m: "Todos", d: "23/05/2025 09:20", f: "PDF" },
  { n: "Relatório de Estoque - 23/05/2025", m: "Todos", d: "23/05/2025 08:30", f: "Excel" },
  { n: "Relatório de Performance - 22/05/2025", m: "Todos", d: "22/05/2025 18:45", f: "PDF" },
  { n: "Relatório de Concorrência - 22/05/2025", m: "Mercado Livre", d: "22/05/2025 17:10", f: "PDF" },
  { n: "Relatório SEO - 21/05/2025", m: "Todos", d: "21/05/2025 16:00", f: "Excel" },
];

function Relatorios() {
  return (
    <>
      <TopBar title="Relatórios" subtitle="Gere relatórios completos com IA e exporte nos formatos desejados" />

      <h2 className="text-sm font-semibold text-foreground mb-3">Relatórios Prontos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {tipos.map((t) => {
          const I = t.i;
          return (
            <Panel key={t.t} className="text-center">
              <div className={`size-10 rounded-lg mx-auto flex items-center justify-center ${t.c}`}>
                <I className="size-5" />
              </div>
              <div className="font-semibold text-sm mt-3">{t.t}</div>
              <div className="text-xs text-muted-foreground mt-1">{t.d}</div>
              <button className="mt-3 w-full rounded-md border border-border py-1.5 text-xs font-semibold hover:bg-accent">Gerar</button>
            </Panel>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel title="Relatórios Gerados Recentemente" className="lg:col-span-2" action={<button className="text-xs text-info font-semibold">Ver todos os relatórios →</button>}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2">Relatório</th><th className="py-2">Marketplace</th><th className="py-2">Data Geração</th><th className="py-2">Formato</th><th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {gerados.map((g) => (
                <tr key={g.n} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{g.n}</td>
                  <td className="py-3 text-muted-foreground">{g.m}</td>
                  <td className="py-3 text-muted-foreground">{g.d}</td>
                  <td className="py-3">{g.f}</td>
                  <td className="py-3"><button className="text-info hover:text-info/80"><Download className="size-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Relatório Executivo IA" action={<span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">Novo!</span>}>
          <p className="text-xs text-muted-foreground mb-4">Gere um relatório executivo completo com IA</p>
          <ul className="space-y-2 text-xs">
            {[
              "Hoje foram analisados 46 SKUs.",
              "4 produtos apresentam risco de ruptura.",
              "7 anúncios possuem oportunidade de melhoria SEO.",
              "Mercado Livre respondeu por 72% do faturamento do dia.",
              "2 campanhas apresentam melhor retorno sobre investimento.",
              "Recomendamos foco em reposição de estoque e otimização de anúncios.",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2"><CheckCircle2 className="size-3.5 text-success mt-0.5 shrink-0" /><span>{i}</span></li>
            ))}
          </ul>
          <button className="mt-4 w-full rounded-md bg-brand-yellow text-brand-navy font-semibold text-sm py-2.5 flex items-center justify-center gap-2 hover:brightness-105">
            <Sparkles className="size-4" /> Gerar Relatório Executivo com IA
          </button>
        </Panel>
      </div>
    </>
  );
}
