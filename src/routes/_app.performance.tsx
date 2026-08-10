import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DollarSign, ShoppingCart, TrendingUp, MapPin, Download, Tag, Trophy, Activity } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MetricCard, Panel, Badge } from "@/components/ui-panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/performance")({
  head: () => ({ meta: [{ title: "Performance — Operações ADB" }] }),
  component: PerformancePage,
});

const MARKETPLACES = ["Mercado Livre", "Magalu"] as const;
type Marketplace = (typeof MARKETPLACES)[number];

const MARKETPLACE_COLORS: Record<Marketplace, string> = {
  "Mercado Livre": "bg-brand-yellow",
  Magalu: "bg-info",
};

type StateRow = {
  uf: string;
  estado: string;
  regiao: "Sudeste" | "Sul" | "Nordeste" | "Centro-Oeste" | "Norte";
  vendas: Record<Marketplace, number>;
};

const STATE_DATA: StateRow[] = [
  { uf: "SP", estado: "São Paulo", regiao: "Sudeste", vendas: { "Mercado Livre": 184230, Magalu: 71200 } },
  { uf: "RJ", estado: "Rio de Janeiro", regiao: "Sudeste", vendas: { "Mercado Livre": 92140, Magalu: 38600 } },
  { uf: "MG", estado: "Minas Gerais", regiao: "Sudeste", vendas: { "Mercado Livre": 76840, Magalu: 41200 } },
  { uf: "RS", estado: "Rio Grande do Sul", regiao: "Sul", vendas: { "Mercado Livre": 58200, Magalu: 24800 } },
  { uf: "PR", estado: "Paraná", regiao: "Sul", vendas: { "Mercado Livre": 52400, Magalu: 22100 } },
  { uf: "SC", estado: "Santa Catarina", regiao: "Sul", vendas: { "Mercado Livre": 41200, Magalu: 17800 } },
  { uf: "BA", estado: "Bahia", regiao: "Nordeste", vendas: { "Mercado Livre": 48200, Magalu: 26800 } },
  { uf: "PE", estado: "Pernambuco", regiao: "Nordeste", vendas: { "Mercado Livre": 32800, Magalu: 18400 } },
  { uf: "CE", estado: "Ceará", regiao: "Nordeste", vendas: { "Mercado Livre": 28400, Magalu: 16200 } },
  { uf: "DF", estado: "Distrito Federal", regiao: "Centro-Oeste", vendas: { "Mercado Livre": 34200, Magalu: 14200 } },
  { uf: "GO", estado: "Goiás", regiao: "Centro-Oeste", vendas: { "Mercado Livre": 24800, Magalu: 11200 } },
  { uf: "PA", estado: "Pará", regiao: "Norte", vendas: { "Mercado Livre": 18200, Magalu: 9800 } },
  { uf: "AM", estado: "Amazonas", regiao: "Norte", vendas: { "Mercado Livre": 12400, Magalu: 6800 } },
];

const CATEGORIAS = ["Castanhas", "Costuráveis", "Kits"] as const;
type Categoria = (typeof CATEGORIAS)[number];

type ProdutoCat = {
  sku: string;
  nome: string;
  categoria: Categoria;
  precoMedio: number;
  // participação de cada marketplace nas vendas do produto (0-1)
  share: Record<Marketplace, number>;
  // vendas (unidades) por UF no mês
  vendasPorUf: Record<string, number>;
};

const PRODUTOS_CAT: ProdutoCat[] = [
  { sku: "CJU100", nome: "Castanha de Caju 100g", categoria: "Castanhas", precoMedio: 20.9,
    share: { "Mercado Livre": 0.72, Magalu: 0.28 },
    vendasPorUf: { SP: 820, RJ: 410, MG: 380, RS: 240, PR: 220, SC: 180, BA: 210, PE: 140, CE: 120, DF: 150, GO: 110, PA: 80, AM: 55 } },
  { sku: "MC100", nome: "Mix de Castanhas 100g", categoria: "Castanhas", precoMedio: 22.9,
    share: { "Mercado Livre": 0.70, Magalu: 0.30 },
    vendasPorUf: { SP: 610, RJ: 290, MG: 265, RS: 180, PR: 165, SC: 140, BA: 160, PE: 105, CE: 92, DF: 118, GO: 84, PA: 62, AM: 44 } },
  { sku: "CAS200", nome: "Castanha do Pará 200g", categoria: "Castanhas", precoMedio: 32.9,
    share: { "Mercado Livre": 0.65, Magalu: 0.35 },
    vendasPorUf: { SP: 340, RJ: 160, MG: 145, RS: 100, PR: 92, SC: 78, BA: 88, PE: 60, CE: 52, DF: 68, GO: 46, PA: 38, AM: 28 } },
  { sku: "ECOBAG-MG", nome: "Ecobag Turma da Mônica", categoria: "Costuráveis", precoMedio: 29.9,
    share: { "Mercado Livre": 0.55, Magalu: 0.45 },
    vendasPorUf: { SP: 180, RJ: 92, MG: 88, RS: 62, PR: 55, SC: 44, BA: 52, PE: 34, CE: 30, DF: 40, GO: 26, PA: 20, AM: 14 } },
  { sku: "NEC-CAS", nome: "Necessaire Cordel", categoria: "Costuráveis", precoMedio: 24.9,
    share: { "Mercado Livre": 0.60, Magalu: 0.40 },
    vendasPorUf: { SP: 130, RJ: 68, MG: 62, RS: 42, PR: 40, SC: 32, BA: 38, PE: 24, CE: 22, DF: 28, GO: 18, PA: 14, AM: 10 } },
  { sku: "AVE-COR", nome: "Avental Cordel", categoria: "Costuráveis", precoMedio: 39.9,
    share: { "Mercado Livre": 0.50, Magalu: 0.50 },
    vendasPorUf: { SP: 90, RJ: 46, MG: 42, RS: 30, PR: 28, SC: 22, BA: 26, PE: 18, CE: 16, DF: 20, GO: 14, PA: 10, AM: 7 } },
  { sku: "KIT03", nome: "Kit Presente 3 Produtos", categoria: "Kits", precoMedio: 65.0,
    share: { "Mercado Livre": 0.68, Magalu: 0.32 },
    vendasPorUf: { SP: 160, RJ: 82, MG: 74, RS: 52, PR: 48, SC: 40, BA: 45, PE: 30, CE: 26, DF: 34, GO: 22, PA: 18, AM: 12 } },
  { sku: "KIT05", nome: "Kit Presente 5 Produtos", categoria: "Kits", precoMedio: 98.0,
    share: { "Mercado Livre": 0.62, Magalu: 0.38 },
    vendasPorUf: { SP: 110, RJ: 56, MG: 50, RS: 34, PR: 32, SC: 26, BA: 30, PE: 20, CE: 18, DF: 24, GO: 15, PA: 12, AM: 8 } },
  { sku: "KIT-NATAL", nome: "Kit Presente Natal", categoria: "Kits", precoMedio: 129.0,
    share: { "Mercado Livre": 0.58, Magalu: 0.42 },
    vendasPorUf: { SP: 78, RJ: 40, MG: 36, RS: 24, PR: 22, SC: 18, BA: 21, PE: 14, CE: 12, DF: 17, GO: 11, PA: 8, AM: 5 } },
];

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtCompact = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `R$ ${v}`;

// unidades do produto no recorte de UF e plataforma
function unidadesDe(p: ProdutoCat, uf: string, plataforma: Marketplace | "todas") {
  const base = uf === "todas"
    ? Object.values(p.vendasPorUf).reduce((a, b) => a + b, 0)
    : (p.vendasPorUf[uf] ?? 0);
  const fator = plataforma === "todas" ? 1 : p.share[plataforma];
  return Math.round(base * fator);
}

function PerformancePage() {
  return (
    <>
      <TopBar title="Performance" subtitle="Indicadores de performance por marketplace e categoria" />
      <Tabs defaultValue="visao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao">Visão Geral</TabsTrigger>
          <TabsTrigger value="categorias">
            <Tag className="size-3.5 mr-1.5" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="geografia">
            <MapPin className="size-3.5 mr-1.5" />
            Geografia
          </TabsTrigger>
          <TabsTrigger value="curva">
            <Activity className="size-3.5 mr-1.5" />
            Curva
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao" className="space-y-4">
          <VisaoGeral />
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <Categorias />
        </TabsContent>

        <TabsContent value="geografia" className="space-y-4">
          <Geografia />
        </TabsContent>

        <TabsContent value="curva" className="space-y-4">
          <Curva />
        </TabsContent>
      </Tabs>
    </>
  );
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const now = new Date();

function Categorias() {
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [plataforma, setPlataforma] = useState<Marketplace | "todas">("todas");
  const [uf, setUf] = useState<string>("todas");
  const [mes, setMes] = useState<string>(String(now.getMonth()));
  const [ano, setAno] = useState<string>(String(now.getFullYear()));

  const produtos = useMemo(() => {
    return PRODUTOS_CAT
      .filter((p) => categoria === "todas" || p.categoria === categoria)
      .map((p) => {
        const unidades = unidadesDe(p, uf, plataforma);
        return { ...p, unidades, receita: unidades * p.precoMedio };
      })
      .sort((a, b) => b.unidades - a.unidades);
  }, [categoria, uf, plataforma]);

  const totalReceita = produtos.reduce((s, p) => s + p.receita, 0);
  const totalUnidades = produtos.reduce((s, p) => s + p.unidades, 0);
  const lider = produtos[0];

  const porCategoria = useMemo(() => {
    return CATEGORIAS.map((cat) => {
      const items = PRODUTOS_CAT.filter((p) => p.categoria === cat).map((p) => {
        const unidades = unidadesDe(p, uf, plataforma);
        return { ...p, unidades, receita: unidades * p.precoMedio };
      }).sort((a, b) => b.unidades - a.unidades);
      const receita = items.reduce((s, p) => s + p.receita, 0);
      const unidades = items.reduce((s, p) => s + p.unidades, 0);
      return { cat, items, receita, unidades, top: items[0] };
    });
  }, [uf, plataforma]);

  // matriz categoria × plataforma (respeita filtro de estado)
  const matriz = useMemo(() => {
    const rows = CATEGORIAS.map((cat) => {
      const porMkt = MARKETPLACES.map((m) => {
        const items = PRODUTOS_CAT.filter((p) => p.categoria === cat).map((p) => {
          const unidades = unidadesDe(p, uf, m);
          return { ...p, unidades, receita: unidades * p.precoMedio };
        }).sort((a, b) => b.unidades - a.unidades);
        return {
          mkt: m,
          unidades: items.reduce((s, p) => s + p.unidades, 0),
          receita: items.reduce((s, p) => s + p.receita, 0),
          top: items[0],
        };
      });
      const receita = porMkt.reduce((s, x) => s + x.receita, 0);
      return { cat, porMkt, receita };
    });
    const total = rows.reduce((s, r) => s + r.receita, 0) || 1;
    return { rows, total };
  }, [uf]);

  const maxUnid = Math.max(1, ...produtos.map((p) => p.unidades));


  return (
    <>
      <Panel>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Categoria</label>
            <Select value={categoria} onValueChange={(v) => setCategoria(v as Categoria | "todas")}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Plataforma</label>
            <Select value={plataforma} onValueChange={(v) => setPlataforma(v as Marketplace | "todas")}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as plataformas</SelectItem>
                {MARKETPLACES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Estado</label>
            <Select value={uf} onValueChange={setUf}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os estados</SelectItem>
                {STATE_DATA.map((s) => <SelectItem key={s.uf} value={s.uf}>{s.uf} — {s.estado}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Mês</label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MESES.map((m, i) => <SelectItem key={m} value={String(i)}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Ano</label>
            <Select value={ano} onValueChange={setAno}>
              <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[0, 1, 2].map((i) => {
                  const y = String(now.getFullYear() - i);
                  return <SelectItem key={y} value={y}>{y}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <Download className="size-3.5 mr-1.5" /> Exportar CSV
          </Button>
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Receita (recorte)" value={fmtBRL(totalReceita)} hint={`${totalUnidades.toLocaleString("pt-BR")} unidades`} icon={<DollarSign className="size-4" />} iconColor="bg-success/15 text-success" />
        <MetricCard label="Produto líder" value={lider?.sku ?? "—"} hint={lider ? `${lider.nome} · ${lider.unidades} un.` : ""} icon={<Trophy className="size-4" />} iconColor="bg-brand-yellow/20 text-brand-orange" />
        <MetricCard label="Plataforma" value={plataforma === "todas" ? "Todas" : plataforma} hint={uf === "todas" ? "todos os estados" : `estado: ${uf}`} icon={<Tag className="size-4" />} />
      </div>

      <Panel title={`Categoria × Plataforma ${uf === "todas" ? "(todos os estados)" : `— ${uf}`}`}>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-2 font-medium">Categoria</th>
                {MARKETPLACES.map((m) => (
                  <th key={m} className="px-3 py-2 font-medium text-right whitespace-nowrap">{m}</th>
                ))}
                <th className="px-3 py-2 font-medium text-right">Total</th>
                <th className="px-5 py-2 font-medium">Mais vendido / plataforma</th>
              </tr>
            </thead>
            <tbody>
              {matriz.rows.map((r) => (
                <tr key={r.cat} className="border-b border-border/50 hover:bg-muted/40 align-top">
                  <td className="px-5 py-2 font-semibold">{r.cat}</td>
                  {r.porMkt.map((x) => (
                    <td key={x.mkt} className="px-3 py-2 text-right tabular-nums">
                      <div className="font-medium">{fmtBRL(x.receita)}</div>
                      <div className="text-[11px] text-muted-foreground">{x.unidades.toLocaleString("pt-BR")} un.</div>
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">
                    {fmtBRL(r.receita)}
                    <div className="text-[11px] text-muted-foreground font-normal">
                      {((r.receita / matriz.total) * 100).toFixed(1)}% do total
                    </div>
                  </td>
                  <td className="px-5 py-2">
                    <div className="flex flex-col gap-1">
                      {r.porMkt.map((x) => (
                        <div key={x.mkt} className="flex items-center gap-2 text-[11px]">
                          <span className={`size-2 rounded-full ${MARKETPLACE_COLORS[x.mkt]}`} />
                          <span className="text-muted-foreground">{x.mkt}:</span>
                          <span className="font-medium">{x.top ? `${x.top.nome} (${x.top.unidades} un.)` : "—"}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {porCategoria.map(({ cat, items, receita, unidades, top }) => (
          <Panel key={cat} title={cat}>
            <div className="text-xs text-muted-foreground mb-3 flex items-center justify-between">
              <span>{unidades.toLocaleString("pt-BR")} un. · {fmtBRL(receita)}</span>
              {top && <Badge variant="muted">Top: {top.sku}</Badge>}
            </div>
            <div className="space-y-2">
              {items.slice(0, 5).map((p) => (
                <div key={p.sku} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{p.nome}</div>
                    <div className="text-[11px] text-muted-foreground">{p.sku}</div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-semibold">{p.unidades} un.</div>
                    <div className="text-[11px] text-muted-foreground">{fmtBRL(p.receita)}</div>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-xs text-muted-foreground">Sem vendas no recorte.</div>}
            </div>
          </Panel>
        ))}
      </div>

      <Panel title={`Ranking de produtos ${uf === "todas" ? "(todos os estados)" : `— ${uf}`} · ${plataforma === "todas" ? "todas as plataformas" : plataforma} · ${MESES[Number(mes)]}/${ano}`}>
        <div className="space-y-3">
          {produtos.map((p, idx) => (
            <div key={p.sku}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center justify-center size-7 rounded-md bg-muted text-xs font-bold shrink-0">{idx + 1}</span>
                  <span className="font-medium truncate">{p.nome}</span>
                  <Badge variant="muted">{p.categoria}</Badge>
                  <span className="text-[11px] text-muted-foreground">{p.sku}</span>
                </div>
                <span className="text-muted-foreground font-semibold shrink-0 ml-3">{p.unidades} un. · {fmtBRL(p.receita)}</span>
              </div>
              {plataforma === "todas" ? (
                <>
                  <div className="flex h-2 rounded-full bg-muted overflow-hidden">
                    {MARKETPLACES.map((m) => (
                      <div
                        key={m}
                        className={MARKETPLACE_COLORS[m]}
                        style={{ width: `${(p.unidades / maxUnid) * 100 * p.share[m]}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-4 mt-1 text-[11px] text-muted-foreground">
                    {MARKETPLACES.map((m) => (
                      <span key={m} className="flex items-center gap-1.5">
                        <span className={`size-2 rounded-full ${MARKETPLACE_COLORS[m]}`} />
                        {m}: {Math.round(p.unidades * p.share[m])} un. ({(p.share[m] * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${MARKETPLACE_COLORS[plataforma]}`} style={{ width: `${(p.unidades / maxUnid) * 100}%` }} />
                </div>
              )}
            </div>
          ))}
          {produtos.length === 0 && <div className="text-sm text-muted-foreground">Nenhum produto para o filtro selecionado.</div>}
        </div>
      </Panel>
    </>
  );
}

function VisaoGeral() {
  const totals = useMemo(() => {
    const byMkt: Record<Marketplace, number> = {
      "Mercado Livre": 0, Magalu: 0,
    };
    let total = 0;
    for (const row of STATE_DATA) {
      for (const m of MARKETPLACES) {
        byMkt[m] += row.vendas[m];
        total += row.vendas[m];
      }
    }
    return { byMkt, total };
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Receita Total (30d)" value={fmtBRL(totals.total)} delta="+12,4%" trend="up" hint="vs. período anterior" icon={<DollarSign className="size-4" />} iconColor="bg-success/15 text-success" />
        <MetricCard label="Pedidos" value="14.832" delta="+8,2%" trend="up" hint="vs. período anterior" icon={<ShoppingCart className="size-4" />} />
        <MetricCard label="Ticket Médio" value="R$ 142" delta="+3,8%" trend="up" icon={<TrendingUp className="size-4" />} iconColor="bg-brand-yellow/20 text-brand-orange" />
        <MetricCard label="Taxa de Conversão" value="3,42%" delta="-0,3pp" trend="down" hint="vs. período anterior" icon={<TrendingUp className="size-4" />} iconColor="bg-info/15 text-info" />
      </div>

      <Panel title="Receita por Marketplace">
        <div className="space-y-3">
          {MARKETPLACES.map((m) => {
            const v = totals.byMkt[m];
            const pct = (v / totals.total) * 100;
            return (
              <div key={m}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{m}</span>
                  <span className="text-muted-foreground">{fmtBRL(v)} · {pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${MARKETPLACE_COLORS[m]}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

function Geografia() {
  const [regiao, setRegiao] = useState<string>("todas");
  const [mktFilter, setMktFilter] = useState<string>("todos");

  const filtered = useMemo(() => {
    return STATE_DATA.filter((r) => regiao === "todas" || r.regiao === regiao);
  }, [regiao]);

  const totalByState = useMemo(() => {
    return filtered.map((r) => {
      const total =
        mktFilter === "todos"
          ? MARKETPLACES.reduce((s, m) => s + r.vendas[m], 0)
          : r.vendas[mktFilter as Marketplace];
      return { ...r, total };
    }).sort((a, b) => b.total - a.total);
  }, [filtered, mktFilter]);

  const maxTotal = Math.max(...totalByState.map((r) => r.total));
  const grandTotal = totalByState.reduce((s, r) => s + r.total, 0);
  const topState = totalByState[0];

  const mktTotalsInScope = useMemo(() => {
    const t: Record<Marketplace, number> = {
      "Mercado Livre": 0, Magalu: 0,
    };
    for (const r of filtered) for (const m of MARKETPLACES) t[m] += r.vendas[m];
    return t;
  }, [filtered]);

  return (
    <>
      <Panel>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Região</label>
              <Select value={regiao} onValueChange={setRegiao}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as regiões</SelectItem>
                  <SelectItem value="Sudeste">Sudeste</SelectItem>
                  <SelectItem value="Sul">Sul</SelectItem>
                  <SelectItem value="Nordeste">Nordeste</SelectItem>
                  <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                  <SelectItem value="Norte">Norte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Marketplace</label>
              <Select value={mktFilter} onValueChange={setMktFilter}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os marketplaces</SelectItem>
                  {MARKETPLACES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button variant="outline" size="sm" className="self-start sm:self-end">
            <Download className="size-3.5 mr-1.5" /> Exportar CSV
          </Button>
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Receita no recorte" value={fmtBRL(grandTotal)} hint={`${totalByState.length} estados`} icon={<DollarSign className="size-4" />} iconColor="bg-success/15 text-success" />
        <MetricCard label="Estado líder" value={topState?.uf ?? "—"} hint={topState ? `${topState.estado} · ${fmtBRL(topState.total)}` : ""} icon={<MapPin className="size-4" />} iconColor="bg-brand-yellow/20 text-brand-orange" />
        <MetricCard label="Concentração SP+RJ+MG" value={`${(((totalByState.filter(s => ["SP","RJ","MG"].includes(s.uf)).reduce((a,b)=>a+b.total,0)) / grandTotal) * 100).toFixed(0)}%`} hint="da receita total" icon={<TrendingUp className="size-4" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Ranking de estados" className="lg:col-span-2">
          <div className="space-y-3">
            {totalByState.map((r) => (
              <div key={r.uf}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center size-7 rounded-md bg-muted text-xs font-bold">{r.uf}</span>
                    <span className="font-medium">{r.estado}</span>
                    <Badge variant="muted">{r.regiao}</Badge>
                  </div>
                  <span className="text-muted-foreground font-semibold">{fmtBRL(r.total)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-yellow to-brand-orange" style={{ width: `${(r.total / maxTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Share por marketplace (no recorte)">
          <div className="space-y-3">
            {MARKETPLACES.map((m) => {
              const v = mktTotalsInScope[m];
              const total = Object.values(mktTotalsInScope).reduce((a, b) => a + b, 0);
              const pct = total ? (v / total) * 100 : 0;
              return (
                <div key={m}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium">{m}</span>
                    <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${MARKETPLACE_COLORS[m]}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{fmtBRL(v)}</div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel title="Vendas por Estado × Marketplace">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-2 font-medium">UF</th>
                <th className="px-3 py-2 font-medium">Estado</th>
                {MARKETPLACES.map((m) => (
                  <th key={m} className="px-3 py-2 font-medium text-right whitespace-nowrap">{m}</th>
                ))}
                <th className="px-5 py-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {totalByState.map((r) => {
                const rowTotal = MARKETPLACES.reduce((s, m) => s + r.vendas[m], 0);
                return (
                  <tr key={r.uf} className="border-b border-border/50 hover:bg-muted/40">
                    <td className="px-5 py-2 font-bold">{r.uf}</td>
                    <td className="px-3 py-2">{r.estado}</td>
                    {MARKETPLACES.map((m) => (
                      <td key={m} className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                        {fmtCompact(r.vendas[m])}
                      </td>
                    ))}
                    <td className="px-5 py-2 text-right tabular-nums font-semibold">{fmtCompact(rowTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function Curva() {
  const [plataforma, setPlataforma] = useState<Marketplace | "todas">("todas");
  const [uf, setUf] = useState<string>("todas");

  const produtos = useMemo(() => {
    return PRODUTOS_CAT.map((p) => {
      const unidades = unidadesDe(p, uf, plataforma);
      return { ...p, unidades, receita: unidades * p.precoMedio };
    }).sort((a, b) => b.receita - a.receita);
  }, [plataforma, uf]);

  const totalReceita = produtos.reduce((s, p) => s + p.receita, 0) || 1;
  let acumulado = 0;
  const comCurva = produtos.map((p) => {
    acumulado += p.receita;
    const pctAcum = (acumulado / totalReceita) * 100;
    const curva: "A" | "B" | "C" = pctAcum <= 80 ? "A" : pctAcum <= 95 ? "B" : "C";
    return { ...p, pctAcum, pctIndiv: (p.receita / totalReceita) * 100, curva };
  });

  const grupos = (["A", "B", "C"] as const).map((c) => {
    const items = comCurva.filter((p) => p.curva === c);
    const receita = items.reduce((s, p) => s + p.receita, 0);
    return { curva: c, items, receita, pct: (receita / totalReceita) * 100 };
  });

  const curvaMeta: Record<"A" | "B" | "C", { label: string; color: string; hint: string }> = {
    A: { label: "Curva A", color: "bg-success", hint: "80% da receita — foco máximo" },
    B: { label: "Curva B", color: "bg-brand-yellow", hint: "15% da receita — monitorar" },
    C: { label: "Curva C", color: "bg-info", hint: "5% da receita — cauda longa" },
  };

  const maxReceita = Math.max(1, ...comCurva.map((p) => p.receita));

  return (
    <>
      <Panel>
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-start sm:items-end">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Plataforma</label>
            <Select value={plataforma} onValueChange={(v) => setPlataforma(v as Marketplace | "todas")}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as plataformas</SelectItem>
                {MARKETPLACES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Estado</label>
            <Select value={uf} onValueChange={setUf}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os estados</SelectItem>
                {STATE_DATA.map((s) => <SelectItem key={s.uf} value={s.uf}>{s.uf} — {s.estado}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="self-start sm:self-end">
            <Download className="size-3.5 mr-1.5" /> Exportar CSV
          </Button>
        </div>
      </Panel>

      <Panel>
        <p className="text-xs text-muted-foreground">
          Classificação de produtos pela <strong>Curva de Pareto (ABC)</strong> no recorte{' '}
          <strong>{plataforma === "todas" ? "todas as plataformas" : plataforma}</strong>{' '}
          {uf === "todas" ? "(todos os estados)" : `(estado: ${uf})`}: <strong>A</strong> concentra 80% da
          receita, <strong>B</strong> os próximos 15% e <strong>C</strong> os 5% restantes.
        </p>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {grupos.map((g) => (
          <MetricCard
            key={g.curva}
            label={curvaMeta[g.curva].label}
            value={`${g.items.length} SKUs`}
            hint={`${fmtBRL(g.receita)} · ${g.pct.toFixed(1)}%`}
            icon={<Activity className="size-4" />}
            iconColor={
              g.curva === "A"
                ? "bg-success/15 text-success"
                : g.curva === "B"
                  ? "bg-brand-yellow/20 text-brand-orange"
                  : "bg-info/15 text-info"
            }
          />
        ))}
      </div>

      <Panel title="Distribuição da receita">
        <div className="flex h-3 w-full rounded-full overflow-hidden">
          {grupos.map((g) => (
            <div key={g.curva} className={curvaMeta[g.curva].color} style={{ width: `${g.pct}%` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs">
          {grupos.map((g) => (
            <div key={g.curva} className="flex items-center gap-2">
              <span className={`inline-block size-3 rounded ${curvaMeta[g.curva].color}`} />
              <span className="font-semibold">{curvaMeta[g.curva].label}</span>
              <span className="text-muted-foreground">{curvaMeta[g.curva].hint}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={`Ranking Pareto por produto · ${plataforma === "todas" ? "Todas as plataformas" : plataforma} · ${uf === "todas" ? "todos os estados" : uf}`}>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Produto</th>
                <th className="px-3 py-2 font-medium">Categoria</th>
                <th className="px-3 py-2 font-medium text-right">Unid.</th>
                <th className="px-3 py-2 font-medium text-right">Receita</th>
                <th className="px-3 py-2 font-medium text-right">% indiv.</th>
                <th className="px-3 py-2 font-medium text-right">% acum.</th>
                <th className="px-5 py-2 font-medium text-center">Curva</th>
              </tr>
            </thead>
            <tbody>
              {comCurva.map((p, idx) => (
                <tr key={p.sku} className="border-b border-border/50 hover:bg-muted/40">
                  <td className="px-5 py-2 tabular-nums text-muted-foreground">{idx + 1}</td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.nome}</div>
                    <div className="text-[11px] text-muted-foreground">{p.sku}</div>
                  </td>
                  <td className="px-3 py-2"><Badge variant="muted">{p.categoria}</Badge></td>
                  <td className="px-3 py-2 text-right tabular-nums">{p.unidades.toLocaleString("pt-BR")}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">{fmtBRL(p.receita)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{p.pctIndiv.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{p.pctAcum.toFixed(1)}%</td>
                  <td className="px-5 py-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center size-7 rounded-md text-xs font-bold text-white ${curvaMeta[p.curva].color}`}
                    >
                      {p.curva}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Curva de Pareto (receita acumulada)">
        <div className="space-y-2">
          {comCurva.map((p) => (
            <div key={p.sku} className="flex items-center gap-3">
              <div className="w-40 shrink-0 text-xs truncate">{p.nome}</div>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full ${curvaMeta[p.curva].color}`}
                  style={{ width: `${(p.receita / maxReceita) * 100}%` }}
                />
              </div>
              <div className="w-24 text-right text-xs tabular-nums text-muted-foreground">
                {p.pctAcum.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
