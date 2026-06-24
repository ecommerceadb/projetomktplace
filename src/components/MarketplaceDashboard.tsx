import { Bot, AlertTriangle, Pause, AlertCircle, HelpCircle, ChevronRight } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { MetricCard, Panel, Badge } from "@/components/ui-panels";

const MARKETPLACE_OPTIONS = [
  { value: "consolidado", label: "Visão Consolidada", to: "/" as const },
  { value: "ml", label: "Mercado Livre", to: "/mercado-livre" as const },
  { value: "magalu", label: "Magazine Luiza", to: "/magazine-luiza" as const },
];

export type MarketplaceKind = "ml" | "magalu";

type KPI = { label: string; value: string; delta: string; down?: boolean };
type Donut = { label: string; value: number; color: string }[];
type ListRow = { k: string; v: string; d: string; down?: boolean };
type Product = { p: string; fat: string; ped: number; tm: string; conv: string };
type Alert = { title: string; text: string };

export type MarketplaceDashboardProps = {
  kind: MarketplaceKind;
  name: string;
  subtitle?: string;
  accent: "yellow" | "blue";
  tabs: string[];
  kpis: KPI[];
  series: { d: string; faturamento: number; pedidos: number }[];
  account: {
    title: string;
    primaryLabel: string;
    primaryValue: string;
    primaryBadge?: string;
    metrics: { k: string; v: string; d: string; down?: boolean }[];
  };
  donutTitle: string;
  donutLegend: string;
  donutCenter: string;
  donutDelta: string;
  donut: Donut;
  midLists: { title: string; rows: ListRow[]; footer?: string }[];
  topProducts: Product[];
  ia: { title: string; lines: string[] };
  alerts: Alert[];
};

export function MarketplaceDashboard(p: MarketplaceDashboardProps) {
  const accentText = p.accent === "yellow" ? "text-brand-orange" : "text-info";
  const accentBg = p.accent === "yellow" ? "bg-brand-yellow" : "bg-info";
  const accentSoft = p.accent === "yellow" ? "bg-brand-yellow/15" : "bg-info/10";
  const lineColor = p.accent === "yellow" ? "var(--brand-yellow)" : "var(--info)";

  return (
    <>
      <TopBar title={p.name} subtitle={p.subtitle ?? "Dashboard de operações"} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {p.tabs.map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              i === 0
                ? `${accentText} border-current`
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {p.kpis.map((k) => (
          <MetricCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            trend={k.down ? "down" : "up"}
            hint="vs período anterior"
          />
        ))}
      </div>

      {/* Evolução de Vendas + Desempenho da Conta */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Panel
          title="Evolução de Vendas"
          className="xl:col-span-2"
          action={
            <select className="rounded-md border border-border bg-card px-2 py-1 text-xs">
              <option>Últimos 30 dias</option>
              <option>Últimos 7 dias</option>
            </select>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={p.series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="d" fontSize={11} />
              <YAxis yAxisId="l" fontSize={11} />
              <YAxis yAxisId="r" orientation="right" fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="l" type="monotone" dataKey="faturamento" name="Faturamento (R$)" stroke={lineColor} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="r" type="monotone" dataKey="pedidos" name="Pedidos" stroke="hsl(262 70% 55%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title={p.account.title} action={<a className="text-xs text-info font-medium">Ver detalhes</a>}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-muted-foreground">{p.account.primaryLabel}</div>
              <div className="text-3xl font-bold text-foreground mt-1">{p.account.primaryValue}</div>
            </div>
            {p.account.primaryBadge ? <Badge variant="success">{p.account.primaryBadge}</Badge> : null}
          </div>
          <ul className="space-y-3">
            {p.account.metrics.map((m) => (
              <li key={m.k} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <AlertCircle className="size-3.5 text-warning" /> {m.k}
                </span>
                <span className="flex items-center gap-2">
                  <span className="font-semibold">{m.v}</span>
                  <span className={`text-[11px] font-semibold ${m.down ? "text-danger" : "text-success"}`}>{m.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Donut + two lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Panel title={p.donutTitle}>
          <div className="text-xs text-muted-foreground mb-1 text-center">{p.donutLegend}</div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={p.donut} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {p.donut.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-bold text-foreground">{p.donutCenter}</div>
            </div>
          </div>
          <div className="text-xs text-center text-success font-semibold mb-3">{p.donutDelta}</div>
          <ul className="space-y-2">
            {p.donut.map((d) => (
              <li key={d.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                  {d.label}
                </span>
                <span className="font-semibold">{d.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        {p.midLists.map((ml) => (
          <Panel key={ml.title} title={ml.title}>
            <ul className="space-y-3">
              {ml.rows.map((r) => (
                <li key={r.k} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{r.k}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{r.v}</span>
                    <span className={`text-[11px] font-semibold ${r.down ? "text-danger" : "text-success"}`}>{r.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            {ml.footer ? (
              <button className="mt-4 w-full text-xs text-info font-medium flex items-center justify-center gap-1">
                {ml.footer} <ChevronRight className="size-3" />
              </button>
            ) : null}
          </Panel>
        ))}
      </div>

      {/* Top Produtos + Análise IA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Panel title="Top Produtos" className="xl:col-span-2" action={<span className="text-xs text-muted-foreground">por faturamento</span>}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2 font-medium">Produto</th>
                <th className="font-medium">Faturamento</th>
                <th className="font-medium">Pedidos</th>
                <th className="font-medium">Ticket Médio</th>
                <th className="font-medium">Conversão</th>
              </tr>
            </thead>
            <tbody>
              {p.topProducts.map((tp) => (
                <tr key={tp.p} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 font-medium">{tp.p}</td>
                  <td>{tp.fat}</td>
                  <td>{tp.ped}</td>
                  <td>{tp.tm}</td>
                  <td>{tp.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className={`rounded-xl ${accentSoft} border border-border p-5 shadow-sm flex flex-col`}>
          <div className="flex items-center gap-2 mb-3">
            <Bot className={`size-5 ${accentText}`} />
            <h3 className="font-semibold text-foreground">{p.ia.title}</h3>
          </div>
          <ul className="space-y-3 text-sm text-foreground/85 flex-1">
            {p.ia.lines.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className={`mt-1 size-1.5 rounded-full ${accentBg} shrink-0`} />
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <button className={`mt-4 w-full rounded-md ${accentBg} text-sidebar font-semibold text-sm py-2.5`}>
            Ver todas recomendações
          </button>
        </div>
      </div>

      {/* Alertas */}
      <Panel
        title="Principais Alertas"
        action={<a className="text-xs text-info font-medium">Ver todos alertas</a>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {p.alerts.map((a) => {
            const Icon = a.title.toLowerCase().includes("paus")
              ? Pause
              : a.title.toLowerCase().includes("pergunt")
                ? HelpCircle
                : AlertTriangle;
            return (
              <div key={a.title} className="rounded-lg border border-border p-3 flex items-start gap-3">
                <div className="size-8 rounded-md bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.text}</div>
                </div>
                <button className="text-xs text-info font-medium shrink-0">Ver</button>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
