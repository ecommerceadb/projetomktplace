// Operational snapshot shared with the AI agent so it can answer questions
// about real numbers, alerts and opportunities surfaced across the dashboard.

export const operationalSnapshot = {
  reference_date: "2025-05-23",
  consolidated: {
    faturamento_total: "R$ 250.430",
    pedidos_totais: 4567,
    produtos_ativos: 2856,
    conversao_media: "2,41%",
    ticket_medio: "R$ 98,56",
    deltas_vs_periodo_anterior: {
      faturamento: "+16,8%",
      pedidos: "+12,3%",
      produtos: "+3,4%",
      conversao: "-4,2%",
      ticket: "+6,1%",
    },
  },
  mercado_livre: {
    faturamento: "R$ 185.420",
    pedidos: 2854,
    conversao: "2,8%",
    ticket_medio: "R$ 65,02",
    anuncios_ativos: 1986,
    buy_box: "92,6% (-2 p.p.)",
    reputacao: "5.0 (MercadoLíder)",
    anuncios_pausados: 32,
    rupturas_full: 11,
    estoque_critico: 27,
  },
  magalu: {
    faturamento: "R$ 72.580",
    pedidos: 1186,
    conversao: "2,1% (-0,2 p.p.)",
    ticket_medio: "R$ 61,17",
    produtos_ativos: 892,
    roas_medio: 8.41,
    avaliacao_loja: "4.8",
    produtos_com_estoque_critico: 46,
    cancelamentos: "0,6%",
  },
  top_produtos: [
    { sku: "CJU100", nome: "Castanha de Caju 100g", vendas_30d_ml: 1856, vendas_30d_mg: 1102, preco_ml: "R$ 20,90" },
    { sku: "MC100", nome: "Mix de Castanhas 100g", vendas_30d_ml: 1245, vendas_30d_mg: 823, preco_ml: "R$ 22,90" },
    { sku: "CCK30", nome: "Cookies Castanha 30g", vendas_30d_ml: 642, vendas_30d_mg: 512, preco_ml: "R$ 6,90" },
    { sku: "MEL300", nome: "Mel Silvestre 300g", vendas_30d_ml: 368, vendas_30d_mg: 298, preco_ml: "R$ 35,90" },
    { sku: "KIT03", nome: "Kit Presente Castanhas", vendas_30d_ml: 312, vendas_30d_mg: 210, preco_ml: "R$ 65,00" },
  ],
  alertas_criticos: [
    "Ruptura de estoque — Castanha de Caju 100g (CJU100) na Mercado Livre, impacto Alto",
    "Estoque crítico — Mix de Castanhas 100g (MC100) na Magalu, impacto Alto",
    "Perda de Buy Box — Kit Presente 3 Produtos (KIT03), impacto Alto",
    "Queda de conversão — Cookies Castanha 30g (CCK30) na Magalu (-9%), impacto Médio",
    "Preço acima da média — Mel Silvestre 300g (MEL300) na Mercado Livre, impacto Médio",
  ],
  oportunidades: {
    crescimento_vendas: { count: 12, potencial: "R$ 27.390/mês adicionais" },
    campanhas_patrocinadas: { count: 8, melhor_roas_estimado: 9.2 },
    melhorias_seo: { count: 7, ganho_medio_visitas: "+15%" },
    otimizacao_preco: { count: 6, ganho_medio_conversao: "+5%" },
  },
  proximas_datas_comerciais: [
    "Dia dos Namorados (12/06) — planejamento ativo",
    "Black Friday (28/11) — reforço de estoque sugerido a partir de 20/10",
    "Natal (25/12) — kits de presente",
  ],
};

export function buildSystemPrompt() {
  return [
    "Você é o **Gerente de Operações IA** da plataforma Operações ADB (Amigos do Bem).",
    "Sua função é ajudar gestores a interpretar dados de vendas, estoque, concorrência, SEO, campanhas e reputação nos marketplaces Mercado Livre e Magalu, e recomendar ações concretas.",
    "",
    "Diretrizes:",
    "- Responda sempre em português do Brasil, tom profissional e direto.",
    "- Use markdown: títulos curtos, listas com bullets, **negrito** para destaques numéricos.",
    "- Quando recomendar ações, separe em blocos: *Diagnóstico*, *Impacto estimado*, *Ações recomendadas*.",
    "- Sempre que possível, cite SKUs, marketplace, percentuais e valores reais do contexto abaixo.",
    "- Se a pergunta não puder ser respondida com os dados disponíveis, diga claramente e sugira qual relatório ou tela consultar.",
    "",
    "## Contexto operacional atual (snapshot do dashboard em 23/05/2025)",
    "```json",
    JSON.stringify(operationalSnapshot, null, 2),
    "```",
  ].join("\n");
}
