import { createFileRoute } from "@tanstack/react-router";
import { MarketplaceDashboard } from "@/components/MarketplaceDashboard";

export const Route = createFileRoute("/_app/mercado-livre")({
  head: () => ({
    meta: [
      { title: "Mercado Livre — Operações ADB" },
      { name: "description", content: "Dashboard de operações da conta Mercado Livre." },
    ],
  }),
  component: MercadoLivrePage,
});

const series = [
  { d: "24/04", faturamento: 9000, pedidos: 120 },
  { d: "29/04", faturamento: 11500, pedidos: 160 },
  { d: "04/05", faturamento: 10200, pedidos: 145 },
  { d: "09/05", faturamento: 13800, pedidos: 195 },
  { d: "14/05", faturamento: 15200, pedidos: 220 },
  { d: "19/05", faturamento: 17400, pedidos: 250 },
  { d: "23/05", faturamento: 19500, pedidos: 285 },
];

function MercadoLivrePage() {
  return (
    <MarketplaceDashboard
      kind="ml"
      name="Mercado Livre"
      accent="yellow"
      tabs={["Visão Geral", "Vendas", "Anúncios", "Reputação", "FULL", "Perguntas", "Buy Box"]}
      kpis={[
        { label: "Faturamento", value: "R$ 185.420", delta: "18,7%" },
        { label: "Pedidos", value: "2.854", delta: "14,1%" },
        { label: "Conversão", value: "2,8%", delta: "0,4 p.p." },
        { label: "Ticket Médio", value: "R$ 65,02", delta: "2,1%" },
        { label: "Anúncios Ativos", value: "1.986", delta: "3,9%" },
      ]}
      series={series}
      account={{
        title: "Desempenho da Conta",
        primaryLabel: "Reputação",
        primaryValue: "5.0",
        primaryBadge: "MercadoLíder",
        metrics: [
          { k: "Reclamações", v: "0,2%", d: "↓ 0,1 p.p.", down: false },
          { k: "Cancelamento", v: "0,3%", d: "↓ 0,1 p.p.", down: false },
          { k: "Envios Atrasados", v: "0,1%", d: "↓ 0,1 p.p.", down: false },
          { k: "100% das vendas", v: "no prazo", d: "+0,2 vs ant.", down: false },
        ],
      }}
      donutTitle="Buy Box"
      donutLegend="Taxa de Ganho"
      donutCenter="92,6%"
      donutDelta="↑ 3,6 p.p. vs período anterior"
      donut={[
        { label: "Ganhas", value: 92.6, color: "hsl(142 71% 45%)" },
        { label: "Perdidas", value: 6.1, color: "hsl(38 92% 50%)" },
        { label: "Em risco", value: 1.3, color: "hsl(0 84% 60%)" },
      ]}
      midLists={[
        {
          title: "Anúncios",
          rows: [
            { k: "Ativos", v: "1.986", d: "↑ 3,9%" },
            { k: "Pausados", v: "32", d: "↓ 11,1%", down: false },
            { k: "Com Problemas", v: "18", d: "↓ 5,3%", down: false },
            { k: "Sem Estoque", v: "24", d: "↑ 14,3%", down: true },
          ],
          footer: "Ver todos anúncios",
        },
        {
          title: "FULL",
          rows: [
            { k: "Estoque FULL", v: "1.268", d: "↑ 7,2%" },
            { k: "Rupturas FULL", v: "11", d: "↓ 21,4%", down: false },
            { k: "Elegíveis para FULL", v: "86", d: "↑ 12,5%" },
            { k: "Cobertura Média", v: "28 dias", d: "↑ 4 dias" },
          ],
          footer: "Ver detalhes FULL",
        },
      ]}
      topProducts={[
        { p: "Castanha de Caju 100g", fat: "R$ 48.650", ped: 742, tm: "R$ 65,55", conv: "2,9%" },
        { p: "Mix de Castanhas 100g", fat: "R$ 37.320", ped: 568, tm: "R$ 65,70", conv: "2,8%" },
        { p: "Cookies Castanha 30g", fat: "R$ 19.120", ped: 364, tm: "R$ 52,53", conv: "2,6%" },
        { p: "Mel Silvestre 300g", fat: "R$ 15.430", ped: 251, tm: "R$ 61,43", conv: "2,7%" },
        { p: "Kit Presente 3 Produtos", fat: "R$ 14.380", ped: 196, tm: "R$ 73,37", conv: "3,1%" },
      ]}
      ia={{
        title: "Análise IA — Mercado Livre",
        lines: [
          "Você perdeu Buy Box em 8 anúncios devido ao preço acima da concorrência.",
          "A Castanha de Caju 100g tem alta demanda e cobertura de apenas 9 dias — considere reposição.",
          "Sua reputação está excelente! Continue mantendo envios no prazo.",
          "12 anúncios podem ter mais conversão com melhoria de título e imagens.",
        ],
      }}
      alerts={[
        { title: "Estoque crítico", text: "Castanha de Caju 100g" },
        { title: "Anúncio pausado", text: "Ecobag Turma da Mônica" },
        { title: "Ruptura FULL", text: "Mix de Castanhas 100g" },
        { title: "Perguntas pendentes", text: "Você tem 18 perguntas" },
      ]}
    />
  );
}
