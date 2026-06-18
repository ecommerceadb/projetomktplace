import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge } from "@/components/ui-panels";
import { Sparkles, Lightbulb, Megaphone, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_app/planejamento")({
  head: () => ({ meta: [{ title: "Planejamento Comercial — Operações ADB" }] }),
  component: Planejamento,
});

const datas = [
  { d: "Dia das Mães", date: "11/05", events: [["Maio", "Campanha ativa 01/05 – 12/05", "success"], ["Junho", "Reforçar estoque de Kits e Canecas. Aumentar investimento em 20%", "info"]] },
  { d: "Semana do Consumidor", date: "05/03 – 22/03", events: [["Maio", "Planejamento 01/03 – 14/03", "warning"], ["Junho", "Campanha ativa 15/03 – 22/03", "success"], ["Julho", "Foco em Frete Grátis e Ofertas Relâmpago", "info"]] },
  { d: "Dia dos Namorados", date: "12/06", events: [["Junho", "Planejamento 20/05 – 11/06", "warning"], ["Julho", "Kits Presente e Canecas. Ações românticas", "info"]] },
  { d: "Black Friday", date: "28/11", events: [["Setembro", "Planejamento 01/11 – 27/11", "warning"], ["Outubro", "Aumentar estoque em 40%. Campanhas antecipadas", "info"]] },
  { d: "Natal", date: "25/12", events: [["Outubro", "Planejamento 01/11 – 24/12", "warning"], ["Outubro", "Kits de presentes e Combos. Comunicação emocional", "info"]] },
  { d: "Ano Novo", date: "01/01/2026", events: [["Outubro", "Planejamento 15/12 – 31/12", "warning"], ["Outubro", "Kits saudáveis e mensagens motivacionais", "info"]] },
];

const recomendacoes = [
  { i: Lightbulb, t: "Estoque", d: "Inicie o aumento de estoque de Castanha de Caju 100g até 20/10 para Black Friday." },
  { i: Megaphone, t: "Campanhas", d: "Kits Presente Castanhas tem potencial de crescimento de 35% no Natal." },
  { i: DollarSign, t: "Precificação", d: "Revise preços em Setembro para ganhar competitividade na Black Friday." },
];

function Planejamento() {
  return (
    <>
      <TopBar title="Planejamento Comercial" subtitle="Planeje ações, campanhas e estoque para as principais datas do calendário comercial." />

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
          <button className="rounded px-3 py-1.5 bg-card font-semibold shadow-sm">Calendário</button>
          <button className="rounded px-3 py-1.5 text-muted-foreground">Lista</button>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-md border border-border bg-card px-3 py-2 text-sm">
            <option>Próximos 6 meses</option>
          </select>
          <button className="rounded-md bg-brand-navy text-white px-4 py-2 text-sm font-semibold">Adicionar Evento</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <div className="grid grid-cols-[200px_repeat(5,1fr)] gap-2 mb-3 text-xs font-semibold text-muted-foreground">
            <div>Maio 2025</div><div>Junho</div><div>Julho</div><div>Agosto</div><div>Setembro</div><div>Outubro</div>
          </div>
          <div className="space-y-3">
            {datas.map((row) => (
              <div key={row.d} className="grid grid-cols-[200px_repeat(5,1fr)] gap-2 items-start border-t border-border pt-3">
                <div>
                  <div className="font-semibold text-sm">{row.d}</div>
                  <div className="text-xs text-muted-foreground">{row.date}</div>
                </div>
                {row.events.map(([_, label, tone], i) => (
                  <div key={i} className={`rounded-md px-2 py-1.5 text-[11px] ${tone === "success" ? "bg-success/15 text-success" : tone === "warning" ? "bg-warning/20 text-warning-foreground" : "bg-info/10 text-info"}`}>
                    {label}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-brand-orange" />
            Planejamento bem executado pode aumentar seu faturamento em até <strong className="text-foreground">28%</strong> nas principais datas.
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Recomendações da IA">
            <ul className="space-y-4">
              {recomendacoes.map((r) => {
                const I = r.i;
                return (
                  <li key={r.t} className="flex gap-3">
                    <div className="size-9 rounded-lg bg-brand-yellow/20 text-brand-orange flex items-center justify-center shrink-0"><I className="size-4" /></div>
                    <div>
                      <div className="font-semibold text-sm">{r.t}</div>
                      <p className="text-xs text-muted-foreground">{r.d}</p>
                      <button className="text-xs text-info font-semibold mt-1">Ver detalhes</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
          <button className="w-full rounded-md bg-brand-navy text-white py-2.5 text-sm font-semibold">Ver calendário completo</button>
          <button className="w-full rounded-md bg-brand-yellow text-brand-navy py-2.5 text-sm font-semibold flex items-center justify-center gap-2"><Sparkles className="size-4" /> Gerar plano com IA</button>
        </div>
      </div>
    </>
  );
}
