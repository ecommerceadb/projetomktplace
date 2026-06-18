import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel } from "@/components/ui-panels";
import { TrendingUp, Megaphone, Search, DollarSign, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/oportunidades")({
  head: () => ({ meta: [{ title: "Oportunidades IA — Operações ADB" }] }),
  component: Oportunidades,
});

const cols = [
  {
    title: "Crescimento de Vendas", count: 12, icon: TrendingUp, color: "text-success",
    items: [
      { n: "Castanha de Caju 100g", desc: "Aumentar orçamento em campanhas", impacto: "R$ 12.450 / mês" },
      { n: "Mix de Castanhas 100g", desc: "Alta demanda e boa conversão", impacto: "R$ 8.730 / mês" },
      { n: "Mel Silvestre 300g", desc: "Expandir para kit com vários sabores", impacto: "R$ 6.210 / mês" },
    ],
  },
  {
    title: "Campanhas Patrocinadas", count: 8, icon: Megaphone, color: "text-info",
    items: [
      { n: "Kit Presente Castanhas", desc: "Excelente margem e procura sazonal", impacto: "ROAS estimado: 9,2" },
      { n: "Cookies Castanha 30g", desc: "Baixa concorrência em anúncios", impacto: "ROAS estimado: 7,6" },
      { n: "Caneca Cordel", desc: "Ótimo produto para datas especiais", impacto: "ROAS estimado: 6,8" },
    ],
  },
  {
    title: "Melhorias de SEO", count: 7, icon: Search, color: "text-brand-orange",
    items: [
      { n: "Cookies Castanha 30g", desc: "Adicionar palavras-chave no título", impacto: "+18% visitas" },
      { n: "Caneca Cordel", desc: "Otimizar descrição e atributos", impacto: "+15% visitas" },
      { n: "Ecobag Turma da Mônica", desc: "Adicionar mais imagens e benefícios", impacto: "+12% visitas" },
    ],
  },
  {
    title: "Otimização de Preço", count: 6, icon: DollarSign, color: "text-brand-navy",
    items: [
      { n: "Castanha de Caju 100g", desc: "Preço acima da média do mercado", impacto: "+6,8% conversão" },
      { n: "Mix de Castanhas 100g", desc: "Ajuste pode aumentar competitividade", impacto: "+5,2% conversão" },
      { n: "Mel Silvestre 300g", desc: "Revisar preço para ganhar destaque", impacto: "+4,1% conversão" },
    ],
  },
];

function Oportunidades() {
  return (
    <>
      <TopBar title="Oportunidades IA" subtitle="Sugestões inteligentes para acelerar seus resultados nos marketplaces." />
      <div className="flex gap-1 rounded-md bg-muted p-1 text-xs w-fit mb-6">
        <button className="rounded px-3 py-1.5 bg-card text-foreground font-semibold shadow-sm">Todos</button>
        <button className="rounded px-3 py-1.5 text-muted-foreground">Mercado Livre</button>
        <button className="rounded px-3 py-1.5 text-muted-foreground">Magalu</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cols.map((c) => {
          const I = c.icon;
          return (
            <Panel key={c.title}>
              <div className="flex items-center gap-2 mb-1">
                <I className={`size-4 ${c.color}`} />
                <h3 className="font-semibold text-sm">{c.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{c.count} oportunidades</p>
              <ol className="space-y-3">
                {c.items.map((i, idx) => (
                  <li key={i.n} className="border-t border-border pt-3 first:border-0 first:pt-0">
                    <div className="flex items-start gap-2">
                      <span className="size-5 rounded-full bg-muted text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                      <div>
                        <div className="text-sm font-semibold">{i.n}</div>
                        <div className="text-xs text-muted-foreground">{i.desc}</div>
                        <div className={`text-xs font-semibold mt-1 ${c.color}`}>{i.impacto}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
              <button className={`mt-4 w-full text-xs font-semibold ${c.color}`}>Ver todas ({c.count})</button>
            </Panel>
          );
        })}
      </div>

      <Panel className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-brand-yellow/30 flex items-center justify-center"><Sparkles className="size-5 text-brand-orange" /></div>
            <p className="text-sm">
              <strong>33 oportunidades</strong> identificadas com potencial de gerar até <strong className="text-success">R$ 27.390/mês</strong> adicionais
            </p>
          </div>
          <button className="rounded-md bg-brand-navy text-white px-5 py-2.5 text-sm font-semibold">Ver plano de ação completo</button>
        </div>
      </Panel>
    </>
  );
}
