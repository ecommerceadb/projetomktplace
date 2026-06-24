import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceDashboard } from "@/components/MarketplaceDashboard";

export const Route = createFileRoute("/_app/magazine-luiza")({
  head: () => ({
    meta: [
      { title: "Magazine Luiza — Operações ADB" },
      { name: "description", content: "Dashboard de operações da conta Magazine Luiza." },
    ],
  }),
  component: MagazineLuizaPage,
});

const series = [
  { d: "24/04", faturamento: 3200, pedidos: 60 },
  { d: "29/04", faturamento: 4100, pedidos: 78 },
  { d: "04/05", faturamento: 4500, pedidos: 82 },
  { d: "09/05", faturamento: 5800, pedidos: 102 },
  { d: "14/05", faturamento: 6400, pedidos: 118 },
  { d: "19/05", faturamento: 7100, pedidos: 130 },
  { d: "23/05", faturamento: 7800, pedidos: 145 },
];

function MagazineLuizaPage() {
  return (
    <MarketplaceDashboard
      kind="magalu"
      name="Magazine Luiza"
      accent="blue"
      tabs={["Visão Geral", "Vendas", "Produtos", "Campanhas", "Avaliações", "Perguntas", "Desempenho"]}
      kpis={[
        { label: "Faturamento", value: "R$ 72.580", delta: "8,2%" },
        { label: "Pedidos", value: "1.186", delta: "6,3%" },
        { label: "Conversão", value: "2,1%", delta: "0,2 p.p.", down: true },
        { label: "Ticket Médio", value: "R$ 61,17", delta: "1,8%" },
        { label: "Produtos Ativos", value: "892", delta: "4,2%" },
      ]}
      series={series}
      account={{
        title: "Desempenho da Loja",
        primaryLabel: "Avaliação da Loja",
        primaryValue: "4.8",
        primaryBadge: "Ótimo",
        metrics: [
          { k: "Cancelamento", v: "0,6%", d: "↓ 0,2 p.p.", down: false },
          { k: "Entrega no Prazo", v: "97,8%", d: "↑ 1,3 p.p." },
          { k: "Reclamações", v: "0,4%", d: "↓ 0,1 p.p.", down: false },
          { k: "+0,1 vs período anterior", v: "—", d: "ótimo" },
        ],
      }}
      donutTitle="Campanhas (Magalu Ads)"
      donutLegend="ROAS Médio"
      donutCenter="8,41"
      donutDelta="↑ 8,7% vs período anterior"
      donut={[
        { label: "Ativas", value: 24, color: "hsl(217 91% 60%)" },
        { label: "Pausadas", value: 3, color: "hsl(38 92% 50%)" },
        { label: "Encerradas", value: 6, color: "hsl(280 70% 55%)" },
      ]}
      midLists={[
        {
          title: "Produtos",
          rows: [
            { k: "Ativos", v: "892", d: "↑ 4,2%" },
            { k: "Pendentes de Ativação", v: "12", d: "↑ 7,7%", down: true },
            { k: "Recusados", v: "7", d: "↓ 12,5%", down: false },
            { k: "Sem Estoque", v: "15", d: "↑ 21,1%", down: true },
          ],
          footer: "Ver todos produtos",
        },
        {
          title: "Avaliações",
          rows: [
            { k: "Avaliação Média", v: "4,8", d: "↑ 0,1" },
            { k: "5 estrelas", v: "82%", d: "↑ 2 p.p." },
            { k: "4 estrelas", v: "12%", d: "↓ 1 p.p.", down: false },
            { k: "1-2 estrelas", v: "2%", d: "↓ 1 p.p.", down: false },
          ],
          footer: "Ver todas avaliações",
        },
      ]}
      topProducts={[
        { p: "Castanha de Caju 100g", fat: "R$ 25.430", ped: 412, tm: "R$ 61,73", conv: "2,2%" },
        { p: "Kit Presente Castanhas", fat: "R$ 12.680", ped: 203, tm: "R$ 62,46", conv: "2,4%" },
        { p: "Mel Silvestre 300g", fat: "R$ 8.950", ped: 146, tm: "R$ 61,30", conv: "2,1%" },
        { p: "Caneca Cordel", fat: "R$ 7.890", ped: 132, tm: "R$ 59,77", conv: "2,0%" },
        { p: "Cookies Castanha 30g", fat: "R$ 6.130", ped: 102, tm: "R$ 60,10", conv: "1,9%" },
      ]}
      ia={{
        title: "Análise IA — Magazine Luiza",
        lines: [
          "Conversão da loja caiu 8% em relação ao período anterior.",
          "12 produtos estão acima da média de preço da categoria.",
          "3 produtos recusados podem ser ajustados para reativação.",
          "Campanha Semana Saudável tem desempenho acima da média.",
        ],
      }}
      alerts={[
        { title: "Produto recusado", text: "3 produtos precisam de ajuste" },
        { title: "Estoque baixo", text: "15 produtos com estoque baixo" },
        { title: "Campanha pausada", text: "Semana Saudável pausada" },
        { title: "Perguntas pendentes", text: "Você tem 7 perguntas" },
      ]}
    />
  );
}
