import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Cell = string | number | Date | null;
export type SheetData = { name: string; headers: string[]; rows: Cell[][] };

type ColKind = "numero" | "moeda" | "percentual" | "data" | "texto" | "vazio";
type ColProfile = {
  name: string;
  idx: number;
  kind: ColKind;
  filled: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
  distinct: number;
  top: [string, number][];
};

const norm = (s: string) =>
  String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();

const parseNum = (v: Cell): number | null => {
  if (typeof v === "number") return isFinite(v) ? v : null;
  if (v == null || v instanceof Date) return null;
  let s = String(v).trim();
  if (!s || !/\d/.test(s) || /[a-z]{2,}/i.test(s.replace(/r\$/i, ""))) return null;
  const neg = /^\(.*\)$/.test(s) || s.startsWith("-");
  s = s.replace(/[R$\s%()\-+]/gi, "");
  if (s.includes(",") && s.includes(".")) {
    s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  } else if (s.includes(",")) s = s.replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = Number(s);
  return isNaN(n) ? null : neg ? -n : n;
};

/** Detecta a linha de cabeçalho real (relatórios de marketplace costumam ter linhas de título antes). */
export function buildSheet(name: string, matrix: unknown[][]): SheetData {
  const m = matrix.map((r) => (r ?? []).map((c) => (c === "" || c === undefined ? null : (c as Cell))));
  let headerIdx = 0;
  let best = -1;
  for (let i = 0; i < Math.min(m.length, 30); i++) {
    const row = m[i];
    const texts = row.filter((c) => typeof c === "string" && c.trim() && parseNum(c) === null).length;
    const next = m[i + 1]?.filter((c) => c != null).length ?? 0;
    const score = texts * 2 + Math.min(next, texts);
    if (texts >= 2 && score > best) { best = score; headerIdx = i; }
  }
  const raw = m[headerIdx] ?? [];
  const width = Math.max(raw.length, ...m.slice(headerIdx + 1).map((r) => r.length));
  const seen: Record<string, number> = {};
  const headers = Array.from({ length: width }, (_, i) => {
    let h = raw[i] != null ? String(raw[i]).trim() : `Coluna ${i + 1}`;
    if (seen[h]) h = `${h} (${++seen[h]})`; else seen[h] = 1;
    return h;
  });
  const rows = m
    .slice(headerIdx + 1)
    .map((r) => Array.from({ length: width }, (_, i) => r[i] ?? null))
    .filter((r) => r.some((c) => c != null))
    .filter((r) => !/^(total|totais|soma)/i.test(String(r.find((c) => c != null) ?? "")));
  return { name, headers, rows };
}

function profile(sheet: SheetData): ColProfile[] {
  return sheet.headers.map((name, idx) => {
    const vals = sheet.rows.map((r) => r[idx]).filter((v) => v != null && String(v).trim() !== "");
    const nums = vals.map(parseNum).filter((n): n is number => n !== null);
    const isDate = vals.length > 0 && vals.filter((v) => v instanceof Date).length / vals.length > 0.6;
    const isNum = !isDate && vals.length > 0 && nums.length / vals.length > 0.7;
    const h = norm(name);
    const kind: ColKind = !vals.length ? "vazio" : isDate ? "data" : isNum
      ? /%|taxa|ctr|acos|tacos|conversao|percent/.test(h) || vals.some((v) => String(v).includes("%")) ? "percentual"
        : /r\$|valor|receita|invest|custo|gasto|fatur|preco|venda.*\(|cpc|ticket|brl/.test(h) || vals.some((v) => String(v).includes("R$")) ? "moeda" : "numero"
      : "texto";
    const counts = new Map<string, number>();
    vals.forEach((v) => { const k = v instanceof Date ? v.toLocaleDateString("pt-BR") : String(v); counts.set(k, (counts.get(k) ?? 0) + 1); });
    const sum = nums.reduce((s, n) => s + n, 0);
    return {
      name, idx, kind, filled: vals.length, sum,
      avg: nums.length ? sum / nums.length : 0,
      min: nums.length ? Math.min(...nums) : 0,
      max: nums.length ? Math.max(...nums) : 0,
      distinct: counts.size,
      top: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3),
    };
  });
}

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
const num = (v: number) => v.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const fmt = (k: ColKind, v: number) => (k === "moeda" ? brl(v) : k === "percentual" ? `${num(v)}%` : num(v));
const show = (c: Cell) => (c == null ? "" : c instanceof Date ? c.toLocaleDateString("pt-BR") : typeof c === "number" ? num(c) : String(c));

const find = (cols: ColProfile[], kws: string[], kinds: ColKind[]) => {
  for (const kw of kws) {
    const c = cols.find((c) => kinds.includes(c.kind) && norm(c.name).includes(kw));
    if (c) return c;
  }
  return undefined;
};

function analyze(sheet: SheetData) {
  const cols = profile(sheet);
  const numeric: ColKind[] = ["numero", "moeda", "percentual"];
  const nameCol = find(cols, ["campanha", "anuncio", "titulo", "produto", "nome", "item", "sku", "categoria"], ["texto"]) ?? cols.find((c) => c.kind === "texto" && c.distinct > 1);
  const inv = find(cols, ["investimento", "custo", "gasto", "spend", "cost", "investido"], ["moeda", "numero"]);
  const rec = find(cols, ["receita", "faturamento", "valor vendido", "vendas (r$)", "vendas brutas", "revenue", "valor total", "venda"], ["moeda", "numero"]);
  const cli = find(cols, ["clique", "click"], ["numero"]);
  const imp = find(cols, ["impress", "visualiza", "prints", "impression"], ["numero"]);
  const ven = find(cols, ["unidades vendidas", "vendas", "pedidos", "conversoes", "quantidade", "unidades", "qtd", "orders"], ["numero"]);
  const metric = rec ?? inv ?? cols.find((c) => c.kind === "moeda") ?? cols.find((c) => c.kind === "numero" && c.distinct > 1);

  const get = (r: Cell[], c?: ColProfile) => (c ? parseNum(r[c.idx]) ?? 0 : 0);
  const items = nameCol
    ? sheet.rows.map((r) => {
        const i = get(r, inv), v = get(r, rec), cl = get(r, cli), im = get(r, imp), q = get(r, ven);
        const roas = i ? v / i : 0;
        return {
          nome: show(r[nameCol.idx]) || "(sem nome)", inv: i, rec: v, cli: cl, imp: im, ven: q, roas,
          acos: v ? (i / v) * 100 : 0, ctr: im ? (cl / im) * 100 : 0, conv: cl ? (q / cl) * 100 : 0,
          metric: get(r, metric),
          status: inv && rec ? (!i ? "Sem custo" : roas >= 5 ? "Escalar" : roas >= 2.5 ? "Otimizar" : "Pausar/Revisar") : "",
        };
      }).sort((a, b) => b.metric - a.metric)
    : [];

  const tInv = inv?.sum ?? 0, tRec = rec?.sum ?? 0, tCli = cli?.sum ?? 0, tImp = imp?.sum ?? 0, tVen = ven?.sum ?? 0;
  const insights: string[] = [];
  insights.push(`Aba "${sheet.name}": ${sheet.rows.length} linhas e ${cols.filter((c) => c.kind !== "vazio").length} colunas com dados.`);
  if (inv && rec) {
    const roas = tInv ? tRec / tInv : 0;
    insights.push(`ROAS geral ${num(roas)} (${roas >= 5 ? "excelente" : roas >= 2.5 ? "razoável" : "abaixo do ideal"}) e ACOS ${num(tRec ? (tInv / tRec) * 100 : 0)}%: investimento de ${brl(tInv)} gerou ${brl(tRec)}.`);
    const esc = items.filter((x) => x.status === "Escalar");
    const pau = items.filter((x) => x.status === "Pausar/Revisar");
    if (esc.length) insights.push(`${esc.length} item(ns) com ROAS ≥ 5 — aumente o orçamento: ${esc.slice(0, 3).map((x) => x.nome).join(", ")}.`);
    if (pau.length) { const w = pau.reduce((s, x) => s + x.inv, 0); insights.push(`${pau.length} item(ns) com ROAS < 2,5 consomem ${brl(w)} (${num(tInv ? (w / tInv) * 100 : 0)}% do investimento) — revisar ou pausar.`); }
  }
  if (cli && imp && tImp) insights.push(`CTR médio ${num((tCli / tImp) * 100)}%${tCli / tImp < 0.01 ? " — abaixo de 1%, melhore títulos e imagens" : ""}.`);
  if (cli && ven && tCli) insights.push(`Taxa de conversão média ${num((tVen / tCli) * 100)}% (${num(tVen)} vendas em ${num(tCli)} cliques).`);
  if (metric && items.length) {
    const top = items.slice(0, 5);
    const share = metric.sum ? (top.reduce((s, x) => s + x.metric, 0) / metric.sum) * 100 : 0;
    insights.push(`Líder em "${metric.name}": ${items[0].nome} com ${fmt(metric.kind, items[0].metric)}. Os 5 primeiros somam ${num(share)}% do total.`);
    const zero = items.filter((x) => x.metric === 0).length;
    if (zero) insights.push(`${zero} item(ns) sem valor em "${metric.name}".`);
  }
  cols.filter((c) => numeric.includes(c.kind) && c !== metric && c !== inv && c !== rec).slice(0, 6).forEach((c) =>
    insights.push(`${c.name}: ${c.kind === "percentual" ? "" : `total ${fmt(c.kind, c.sum)}, `}média ${fmt(c.kind, c.avg)} (mín ${fmt(c.kind, c.min)}, máx ${fmt(c.kind, c.max)}).`),
  );
  cols.filter((c) => c.kind === "texto" && c !== nameCol && c.distinct > 1 && c.distinct <= 15).slice(0, 3).forEach((c) =>
    insights.push(`${c.name}: ${c.distinct} valores — mais frequentes: ${c.top.map(([k, n]) => `${k} (${n})`).join(", ")}.`),
  );

  const kpis: [string, string][] = [["Linhas", num(sheet.rows.length)]];
  if (inv) kpis.push(["Investimento", brl(tInv)]);
  if (rec) kpis.push(["Receita", brl(tRec)]);
  if (inv && rec) kpis.push(["ROAS", num(tInv ? tRec / tInv : 0)]);
  if (ven) kpis.push([ven.name, num(tVen)]);
  if (cli) kpis.push(["Cliques", num(tCli)]);
  if (imp) kpis.push(["Impressões", num(tImp)]);
  cols.filter((c) => (c.kind === "moeda" || c.kind === "numero") && ![inv, rec, ven, cli, imp].includes(c)).forEach((c) => {
    if (kpis.length < 8) kpis.push([c.name, fmt(c.kind, c.sum)]);
  });

  return { cols, items, insights, kpis, nameCol, metric, hasAds: !!(inv && rec), hasCtr: !!(cli && imp), hasConv: !!(cli && ven) };
}

const KIND_LABEL: Record<ColKind, string> = { numero: "Número", moeda: "Moeda", percentual: "Percentual", data: "Data", texto: "Texto", vazio: "Vazia" };

function SheetAnalysis({ sheet }: { sheet: SheetData }) {
  const a = analyze(sheet);
  return (
    <Tabs defaultValue="resumo" className="space-y-3">
      <TabsList>
        <TabsTrigger value="resumo">Resumo</TabsTrigger>
        <TabsTrigger value="ranking">Ranking</TabsTrigger>
        <TabsTrigger value="colunas">Colunas ({a.cols.length})</TabsTrigger>
        <TabsTrigger value="dados">Dados</TabsTrigger>
      </TabsList>

      <TabsContent value="resumo" className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {a.kpis.map(([l, v]) => (
            <div key={l} className="rounded-xl border border-border bg-card p-3 text-center">
              <div className="text-[11px] text-muted-foreground truncate">{l}</div>
              <div className="text-sm font-bold text-foreground">{v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <div className="text-sm font-semibold text-foreground mb-2">Diagnóstico</div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
            {a.insights.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="ranking">
        {a.items.length ? (
          <div className="overflow-x-auto rounded-xl border border-border max-h-[55vh]">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground sticky top-0">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">{a.nameCol?.name}</th>
                  {a.hasAds ? <><th className="p-2 text-left">Investimento</th><th className="p-2 text-left">Receita</th><th className="p-2 text-left">ROAS</th><th className="p-2 text-left">ACOS</th></> : <th className="p-2 text-left">{a.metric?.name}</th>}
                  {a.hasCtr && <th className="p-2 text-left">CTR</th>}
                  {a.hasConv && <th className="p-2 text-left">Conversão</th>}
                  {a.hasAds && <th className="p-2 text-left">Ação</th>}
                </tr>
              </thead>
              <tbody>
                {a.items.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2 text-muted-foreground">{i + 1}</td>
                    <td className="p-2 max-w-[260px] truncate">{r.nome}</td>
                    {a.hasAds ? <><td className="p-2">{brl(r.inv)}</td><td className="p-2">{brl(r.rec)}</td><td className="p-2 font-semibold">{num(r.roas)}</td><td className="p-2">{num(r.acos)}%</td></> : <td className="p-2 font-semibold">{a.metric ? fmt(a.metric.kind, r.metric) : ""}</td>}
                    {a.hasCtr && <td className="p-2">{num(r.ctr)}%</td>}
                    {a.hasConv && <td className="p-2">{num(r.conv)}%</td>}
                    {a.hasAds && (
                      <td className="p-2">
                        <span className={`rounded-full px-2 py-0.5 font-semibold ${r.status === "Escalar" ? "bg-success/15 text-success" : r.status === "Otimizar" ? "bg-warning/15 text-warning" : r.status === "Pausar/Revisar" ? "bg-danger/15 text-danger" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-muted-foreground">Nenhuma coluna de nome/produto identificada para montar o ranking.</p>}
      </TabsContent>

      <TabsContent value="colunas">
        <div className="overflow-x-auto rounded-xl border border-border max-h-[55vh]">
          <table className="w-full text-xs">
            <thead className="bg-muted text-muted-foreground sticky top-0">
              <tr>{["Coluna", "Tipo", "Preenchidas", "Total", "Média", "Mín", "Máx", "Valores mais comuns"].map((h) => <th key={h} className="p-2 text-left">{h}</th>)}</tr>
            </thead>
            <tbody>
              {a.cols.map((c) => {
                const n = c.kind === "numero" || c.kind === "moeda" || c.kind === "percentual";
                return (
                  <tr key={c.idx} className="border-t border-border">
                    <td className="p-2 font-medium max-w-[200px] truncate">{c.name}</td>
                    <td className="p-2">{KIND_LABEL[c.kind]}</td>
                    <td className="p-2">{c.filled}/{sheet.rows.length}</td>
                    <td className="p-2">{n && c.kind !== "percentual" ? fmt(c.kind, c.sum) : "—"}</td>
                    <td className="p-2">{n ? fmt(c.kind, c.avg) : "—"}</td>
                    <td className="p-2">{n ? fmt(c.kind, c.min) : "—"}</td>
                    <td className="p-2">{n ? fmt(c.kind, c.max) : "—"}</td>
                    <td className="p-2 max-w-[260px] truncate">{n ? `${c.distinct} distintos` : c.top.map(([k, q]) => `${k} (${q})`).join(", ")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="dados">
        <div className="overflow-auto rounded-xl border border-border max-h-[55vh]">
          <table className="text-xs">
            <thead className="bg-muted text-muted-foreground sticky top-0">
              <tr>{sheet.headers.map((h) => <th key={h} className="p-2 text-left whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {sheet.rows.slice(0, 500).map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {r.map((c, j) => <td key={j} className="p-2 whitespace-nowrap max-w-[240px] truncate">{show(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sheet.rows.length > 500 && <p className="text-xs text-muted-foreground mt-1">Mostrando 500 de {sheet.rows.length} linhas (a análise considera todas).</p>}
      </TabsContent>
    </Tabs>
  );
}

export function CampaignFileAnalysis({
  open, onOpenChange, fileName, sheets,
}: { open: boolean; onOpenChange: (o: boolean) => void; fileName: string; sheets: SheetData[] }) {
  const [active, setActive] = useState(0);
  const sheet = sheets[Math.min(active, sheets.length - 1)];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Análise do arquivo</DialogTitle>
          <DialogDescription className="truncate">{fileName}</DialogDescription>
        </DialogHeader>
        {sheets.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {sheets.map((s, i) => (
              <button key={s.name} onClick={() => setActive(i)} className={`rounded-full px-3 py-1 text-xs font-semibold border ${i === active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
                {s.name} ({s.rows.length})
              </button>
            ))}
          </div>
        )}
        <SheetAnalysis key={sheet.name} sheet={sheet} />
      </DialogContent>
    </Dialog>
  );
}
