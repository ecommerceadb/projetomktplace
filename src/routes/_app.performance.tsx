import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DollarSign, ShoppingCart, TrendingUp, MapPin, Download } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MetricCard, Panel, Badge } from "@/components/ui-panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/performance")({
  head: () => ({ meta: [{ title: "Performance — Operações ADB" }] }),
  component: PerformancePage,
});

const MARKETPLACES = ["Mercado Livre", "Amazon", "Shopee", "Magalu", "Site Próprio"] as const;
type Marketplace = (typeof MARKETPLACES)[number];

const MARKETPLACE_COLORS: Record<Marketplace, string> = {
  "Mercado Livre": "bg-brand-yellow",
  Amazon: "bg-brand-orange",
  Shopee: "bg-danger",
  Magalu: "bg-info",
  "Site Próprio": "bg-success",
};

type StateRow = {
  uf: string;
  estado: string;
  regiao: "Sudeste" | "Sul" | "Nordeste" | "Centro-Oeste" | "Norte";
  vendas: Record<Marketplace, number>;
};

const STATE_DATA: StateRow[] = [
  { uf: "SP", estado: "São Paulo", regiao: "Sudeste", vendas: { "Mercado Livre": 184230, Amazon: 142800, Shopee: 96540, Magalu: 71200, "Site Próprio": 48900 } },
  { uf: "RJ", estado: "Rio de Janeiro", regiao: "Sudeste", vendas: { "Mercado Livre": 92140, Amazon: 78320, Shopee: 54200, Magalu: 38600, "Site Próprio": 22400 } },
  { uf: "MG", estado: "Minas Gerais", regiao: "Sudeste", vendas: { "Mercado Livre": 76840, Amazon: 61200, Shopee: 49830, Magalu: 41200, "Site Próprio": 18700 } },
  { uf: "RS", estado: "Rio Grande do Sul", regiao: "Sul", vendas: { "Mercado Livre": 58200, Amazon: 47100, Shopee: 31400, Magalu: 24800, "Site Próprio": 14200 } },
  { uf: "PR", estado: "Paraná", regiao: "Sul", vendas: { "Mercado Livre": 52400, Amazon: 41800, Shopee: 28900, Magalu: 22100, "Site Próprio": 12600 } },
  { uf: "SC", estado: "Santa Catarina", regiao: "Sul", vendas: { "Mercado Livre": 41200, Amazon: 34600, Shopee: 22400, Magalu: 17800, "Site Próprio": 10400 } },
  { uf: "BA", estado: "Bahia", regiao: "Nordeste", vendas: { "Mercado Livre": 48200, Amazon: 32400, Shopee: 41200, Magalu: 26800, "Site Próprio": 9800 } },
  { uf: "PE", estado: "Pernambuco", regiao: "Nordeste", vendas: { "Mercado Livre": 32800, Amazon: 21400, Shopee: 28200, Magalu: 18400, "Site Próprio": 6400 } },
  { uf: "CE", estado: "Ceará", regiao: "Nordeste", vendas: { "Mercado Livre": 28400, Amazon: 18200, Shopee: 24800, Magalu: 16200, "Site Próprio": 5200 } },
  { uf: "DF", estado: "Distrito Federal", regiao: "Centro-Oeste", vendas: { "Mercado Livre": 34200, Amazon: 28600, Shopee: 18400, Magalu: 14200, "Site Próprio": 9400 } },
  { uf: "GO", estado: "Goiás", regiao: "Centro-Oeste", vendas: { "Mercado Livre": 24800, Amazon: 19400, Shopee: 14800, Magalu: 11200, "Site Próprio": 5800 } },
  { uf: "PA", estado: "Pará", regiao: "Norte", vendas: { "Mercado Livre": 18200, Amazon: 11400, Shopee: 16800, Magalu: 9800, "Site Próprio": 3200 } },
  { uf: "AM", estado: "Amazonas", regiao: "Norte", vendas: { "Mercado Livre": 12400, Amazon: 8200, Shopee: 11200, Magalu: 6800, "Site Próprio": 2400 } },
];

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtCompact = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k` : `R$ ${v}`;

function PerformancePage() {
  return (
    <>
      <TopBar title="Performance" subtitle="Indicadores de performance por marketplace e categoria" />
      <Tabs defaultValue="visao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visao">Visão Geral</TabsTrigger>
          <TabsTrigger value="geografia">
            <MapPin className="size-3.5 mr-1.5" />
            Geografia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao" className="space-y-4">
          <VisaoGeral />
        </TabsContent>

        <TabsContent value="geografia" className="space-y-4">
          <Geografia />
        </TabsContent>
      </Tabs>
    </>
  );
}

function VisaoGeral() {
  const totals = useMemo(() => {
    const byMkt: Record<Marketplace, number> = {
      "Mercado Livre": 0, Amazon: 0, Shopee: 0, Magalu: 0, "Site Próprio": 0,
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
      "Mercado Livre": 0, Amazon: 0, Shopee: 0, Magalu: 0, "Site Próprio": 0,
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
