import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type ParsedCampaign = {
  nome: string;
  investimento: number;
  receita: number;
  vendas: number;
  cliques: number;
  impressoes: number;
};

const norm = (s: string) =>
  s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const toNum = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  let s = String(v).replace(/[R$\s%]/g, "");
  if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
  else if (s.includes(",")) s = s.replace(",", ".");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

const FIELDS: Record<keyof ParsedCampaign, string[]> = {
  nome: ["campanha", "nome", "anuncio", "titulo", "produto", "campaign", "item"],
  investimento: ["investimento", "custo", "gasto", "spend", "cost", "valor investido"],
  receita: ["receita", "faturamento", "vendas (r$)", "valor vendido", "revenue", "venda bruta", "receita total"],
  vendas: ["vendas", "pedidos", "unidades", "conversoes", "orders", "qtd"],
  cliques: ["cliques", "clicks", "clique"],
  impressoes: ["impressoes", "impressions", "visualizacoes", "prints"],
};

export function parseCampaignRows(rows: Record<string, unknown>[]): ParsedCampaign[] {
  if (!rows.length) return [];
  const headers = Object.keys(rows[0]);
  const map: Partial<Record<keyof ParsedCampaign, string>> = {};
  (Object.keys(FIELDS) as (keyof ParsedCampaign)[]).forEach((f) => {
    for (const kw of FIELDS[f]) {
      const h = headers.find((h) => norm(h) === kw) ?? headers.find((h) => norm(h).includes(kw) && !Object.values(map).includes(h));
      if (h) { map[f] = h; break; }
    }
  });
  if (!map.nome) map.nome = headers[0];
  return rows
    .map((r) => ({
      nome: String(r[map.nome!] ?? "").trim(),
      investimento: map.investimento ? toNum(r[map.investimento]) : 0,
      receita: map.receita ? toNum(r[map.receita]) : 0,
      vendas: map.vendas ? toNum(r[map.vendas]) : 0,
      cliques: map.cliques ? toNum(r[map.cliques]) : 0,
      impressoes: map.impressoes ? toNum(r[map.impressoes]) : 0,
    }))
    .filter((c) => c.nome && (c.investimento || c.receita || c.cliques || c.vendas));
}

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
const pct = (v: number) => `${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

export function CampaignFileAnalysis({
  open, onOpenChange, fileName, data,
}: { open: boolean; onOpenChange: (o: boolean) => void; fileName: string; data: ParsedCampaign[] }) {
  const inv = data.reduce((s, c) => s + c.investimento, 0);
  const rec = data.reduce((s, c) => s + c.receita, 0);
  const cli = data.reduce((s, c) => s + c.cliques, 0);
  const imp = data.reduce((s, c) => s + c.impressoes, 0);
  const ven = data.reduce((s, c) => s + c.vendas, 0);
  const roas = inv ? rec / inv : 0;
  const acos = rec ? (inv / rec) * 100 : 0;

  const rows = data
    .map((c) => {
      const r = c.investimento ? c.receita / c.investimento : 0;
      const status = !c.investimento ? "Sem custo" : r >= 5 ? "Escalar" : r >= 2.5 ? "Otimizar" : "Pausar/Revisar";
      return { ...c, roas: r, acos: c.receita ? (c.investimento / c.receita) * 100 : 0, ctr: c.impressoes ? (c.cliques / c.impressoes) * 100 : 0, conv: c.cliques ? (c.vendas / c.cliques) * 100 : 0, status };
    })
    .sort((a, b) => b.receita - a.receita);

  const escalar = rows.filter((r) => r.status === "Escalar");
  const pausar = rows.filter((r) => r.status === "Pausar/Revisar");
  const desperdicio = pausar.reduce((s, r) => s + r.investimento, 0);

  const insights: string[] = [];
  if (!data.length) insights.push("Não encontramos colunas reconhecíveis. Use colunas como Campanha, Investimento, Receita, Cliques, Impressões e Vendas.");
  else {
    insights.push(`ROAS geral de ${roas.toFixed(2)} (${roas >= 5 ? "excelente" : roas >= 2.5 ? "razoável" : "abaixo do ideal"}) com ACOS de ${pct(acos)}.`);
    if (escalar.length) insights.push(`${escalar.length} campanha(s) com ROAS ≥ 5 — aumente o orçamento: ${escalar.slice(0, 3).map((r) => r.nome).join(", ")}.`);
    if (pausar.length) insights.push(`${pausar.length} campanha(s) com ROAS < 2,5 consomem ${brl(desperdicio)} (${inv ? pct((desperdicio / inv) * 100) : "-"} do investimento). Revise ou pause.`);
    if (rows[0]) insights.push(`Maior receita: "${rows[0].nome}" com ${brl(rows[0].receita)}.`);
    if (imp && cli / imp < 0.01) insights.push("CTR médio abaixo de 1% — melhore títulos e imagens dos anúncios.");
  }

  const kpis = [
    ["Campanhas", String(data.length)],
    ["Investimento", brl(inv)],
    ["Receita", brl(rec)],
    ["ROAS", roas.toFixed(2)],
    ["ACOS", pct(acos)],
    ["Vendas", ven.toLocaleString("pt-BR")],
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Análise do arquivo</DialogTitle>
          <DialogDescription className="truncate">{fileName}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {kpis.map(([l, v]) => (
            <div key={l} className="rounded-xl border border-border bg-card p-3 text-center">
              <div className="text-[11px] text-muted-foreground">{l}</div>
              <div className="text-sm font-bold text-foreground">{v}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="text-sm font-semibold text-foreground mb-2">Diagnóstico</div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
            {insights.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>

        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground">
                <tr>{["Campanha", "Investimento", "Receita", "ROAS", "ACOS", "CTR", "Conversão", "Ação"].map((h) => <th key={h} className="p-2 text-left font-semibold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 max-w-[220px] truncate">{r.nome}</td>
                    <td className="p-2">{brl(r.investimento)}</td>
                    <td className="p-2">{brl(r.receita)}</td>
                    <td className="p-2 font-semibold">{r.roas.toFixed(2)}</td>
                    <td className="p-2">{pct(r.acos)}</td>
                    <td className="p-2">{pct(r.ctr)}</td>
                    <td className="p-2">{pct(r.conv)}</td>
                    <td className="p-2">
                      <span className={`rounded-full px-2 py-0.5 font-semibold ${r.status === "Escalar" ? "bg-success/15 text-success" : r.status === "Otimizar" ? "bg-warning/15 text-warning" : r.status === "Pausar/Revisar" ? "bg-danger/15 text-danger" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
