import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Percent,
  Tag,
  Bot,
  Sparkles,
  FileText,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { MetricCard, Panel, Badge } from "@/components/ui-panels";
import { TopBar } from "@/components/TopBar";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Operações ADB" },
      { name: "description", content: "Painel consolidado de operações de marketplace dos Amigos do Bem." },
    ],
  }),
  component: Dashboard,
});

const mlData = [
  { d: "17/05", v: 15000 }, { d: "18/05", v: 18000 }, { d: "19/05", v: 16500 },
  { d: "20/05", v: 22000 }, { d: "21/05", v: 21000 }, { d: "22/05", v: 24500 }, { d: "23/05", v: 28000 },
];
const mgData = [
  { d: "17/05", v: 6000 }, { d: "18/05", v: 7500 }, { d: "19/05", v: 7200 },
  { d: "20/05", v: 9000 }, { d: "21/05", v: 8500 }, { d: "22/05", v: 11000 }, { d: "23/05", v: 12000 },
];
const compData = mlData.map((p, i) => ({ d: p.d, ml: p.v, mg: mgData[i].v }));

function Dashboard() {
  return (
    <>
      <TopBar
        title="Dashboard"
        right={
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Marketplace:</span>
            <select className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium">
              <option>Visão Consolidada</option>
              <option>Mercado Livre</option>
              <option>Magazine Luiza</option>
            </select>
          </div>
        }
      />

      {/* Marketplace selector tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="/" className="rounded-xl border-2 border-brand-navy bg-brand-navy text-white p-4 flex items-center justify-between shadow-sm hover:brightness-110 transition">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="font-semibold">Visão Consolidada</div>
              <div className="text-xs opacity-80">Todos os marketplaces</div>
            </div>
          </div>
          <ChevronRight className="size-5 opacity-70" />
        </Link>
        <Link to="/mercado-livre" className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-brand-yellow/20 flex items-center justify-center font-bold text-xs text-brand-orange">ML</div>
            <div>
              <div className="font-semibold text-foreground">Mercado Livre</div>
              <div className="text-xs text-muted-foreground">Dashboard de operações</div>
            </div>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>
        <Link to="/magazine-luiza" className="rounded-xl border border-border bg-card p-4 flex items-center justify-between shadow-sm hover:border-info hover:bg-info/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-info/15 flex items-center justify-center font-bold text-xs text-info">MG</div>
            <div>
              <div className="font-semibold text-foreground">Magazine Luiza</div>
              <div className="text-xs text-muted-foreground">Dashboard de operações</div>
            </div>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-9 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard label="Faturamento Total" value="R$ 250.430" delta="16,8%" hint="vs período anterior" icon={<DollarSign className="size-4" />} iconColor="bg-success/15 text-success" />
            <MetricCard label="Pedidos Totais" value="4.567" delta="12,3%" hint="vs período anterior" icon={<ShoppingBag className="size-4" />} iconColor="bg-brand-yellow/25 text-brand-orange" />
            <MetricCard label="Produtos Ativos" value="2.856" delta="3,4%" hint="vs período anterior" icon={<Package className="size-4" />} iconColor="bg-brand-navy/10 text-brand-navy" />
            <MetricCard label="Conversão Média" value="2,41%" delta="4,2%" trend="down" hint="vs período anterior" icon={<Percent className="size-4" />} iconColor="bg-danger/15 text-danger" />
            <MetricCard label="Ticket Médio" value="R$ 98,56" delta="6,1%" hint="vs período anterior" icon={<Tag className="size-4" />} iconColor="bg-info/15 text-info" />
          </div>

          {/* Marketplace performance split */}
          <Panel title="Desempenho por Marketplace">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Link to="/mercado-livre">
                <MarketplaceMiniCard
                  name="mercado livre"
                  tone="yellow"
                  metrics={[
                    { k: "Faturamento", v: "R$ 180.250", d: "18,7%" },
                    { k: "Pedidos", v: "3.201", d: "14,5%" },
                    { k: "Conversão", v: "2,62%", d: "-3,1%", down: true },
                    { k: "Buy Box", v: "87%", d: "-2 p.p.", down: true },
                  ]}
                  secondary={[
                    { k: "Anúncios pausados", v: "32", d: "↑ 6" },
                    { k: "Produtos sem estoque", v: "18", d: "↓ -4", down: true },
                    { k: "Estoque crítico", v: "27", d: "↑ 3" },
                    { k: "Reputação", v: "4,8", d: "↑ 0,1" },
                  ]}
                />
              </Link>
              <Link to="/magazine-luiza">
                <MarketplaceMiniCard
                  name="Magazine Luiza"
                  tone="blue"
                  metrics={[
                    { k: "Faturamento", v: "R$ 70.180", d: "5,2%" },
                    { k: "Pedidos", v: "1.366", d: "3,4%" },
                    { k: "Conversão", v: "2,11%", d: "-9,2%", down: true },
                    { k: "Campanhas ativas", v: "8", d: "↑ 1" },
                  ]}
                  secondary={[
                    { k: "Produtos c/ estoque crítico", v: "46", d: "↑ 8" },
                    { k: "Anúncios pausados", v: "14", d: "↓ -2", down: true },
                    { k: "Reputação", v: "4,6", d: "↑ 0,2" },
                    { k: "Avaliação média", v: "4,7", d: "↑ 0,1" },
                  ]}
                />
              </Link>
            </div>
          </Panel>

          {/* Charts */}
          <Panel
            title="Evolução de Faturamento"
            action={
              <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
                <button className="rounded px-3 py-1 bg-brand-navy text-white font-medium">Faturamento</button>
                <button className="rounded px-3 py-1 text-muted-foreground">Pedidos</button>
                <button className="rounded px-3 py-1 text-muted-foreground">Conversão</button>
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ChartBlock title="Mercado Livre" right={<span className="text-success text-xs font-semibold">R$ 180.250 ↑ 18,7%</span>}>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={mlData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="d" fontSize={11} stroke="currentColor" className="text-muted-foreground" />
                    <YAxis fontSize={11} stroke="currentColor" className="text-muted-foreground" />
                    <Tooltip />
                    <Line type="monotone" dataKey="v" stroke="var(--brand-yellow)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBlock>
              <ChartBlock title="Magazine Luiza" right={<span className="text-success text-xs font-semibold">R$ 70.180 ↑ 5,2%</span>}>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={mgData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis dataKey="d" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="v" stroke="var(--info)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBlock>
              <ChartBlock title="Comparativo">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={compData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                    <XAxis dataKey="d" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="ml" name="Mercado Livre" stroke="var(--brand-yellow)" strokeWidth={2} />
                    <Line type="monotone" dataKey="mg" name="Magazine Luiza" stroke="var(--info)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartBlock>
            </div>
          </Panel>

          {/* Priorities */}
          <Panel title="Principais Prioridades por Marketplace">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <PriorityCard title="Mercado Livre" tone="danger" badge="URGENTE" items={[
                "3 produtos sem estoque",
                "5 Buy Box perdidas",
                "2 anúncios pausados",
              ]} />
              <PriorityCard title="Magazine Luiza" tone="warning" badge="ATENÇÃO" items={[
                "12 produtos com estoque crítico",
                "Conversão caiu 9%",
                "8 produtos com preço acima da média",
              ]} />
              <PriorityCard title="Consolidado" tone="success" badge="OPORTUNIDADES" items={[
                "15 produtos com alto potencial",
                "9 produtos para campanha",
                "23 produtos com margem para promoção",
              ]} />
            </div>
          </Panel>
        </div>

        {/* Right rail */}
        <div className="col-span-12 xl:col-span-3 space-y-6">
          <div className="rounded-xl bg-brand-navy text-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="size-5 text-brand-yellow" />
              <h3 className="font-semibold">Gerente de Operações IA</h3>
              <Sparkles className="size-4 text-brand-yellow ml-auto" />
            </div>
            <p className="text-xs text-white/70 mb-4">Resumo diário consolidado</p>

            <div className="flex gap-1 rounded-md bg-white/10 p-1 text-xs mb-4">
              <button className="rounded px-2 py-1 text-white/80">Mercado Livre</button>
              <button className="rounded px-2 py-1 text-white/80">Magazine Luiza</button>
              <button className="rounded px-2 py-1 bg-white text-brand-navy font-semibold">Consolidado</button>
            </div>

            <p className="text-sm font-medium mb-3">Hoje foram identificadas 18 ações prioritárias.</p>
            <ul className="space-y-2 text-xs mb-4">
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-danger" /> 6 urgentes (risco imediato)</li>
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-warning" /> 7 em atenção (impacto médio)</li>
              <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-success" /> 5 oportunidades (alto potencial)</li>
            </ul>

            <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-xs mb-4">
              <div className="font-semibold text-brand-yellow mb-1">Prioridade máxima:</div>
              <p className="text-white/85">Repor estoque dos SKUs ML123 e MAG456 e ajustar preço de 8 produtos na Magazine Luiza.</p>
            </div>

            <Link to="/chat" className="block text-center rounded-md bg-brand-yellow text-brand-navy font-semibold text-sm py-2.5 hover:brightness-105">
              Ver todas as recomendações
            </Link>
          </div>


          <Panel
            title="Últimas importações"
            action={<Link to="/relatorios" className="text-xs text-info font-medium">Ver todas</Link>}
          >
            <ul className="space-y-3">
              {[
                { n: "Relatório de Estoque - Mercado Livre", d: "23/05/2025 09:15", r: "2.356 registros", s: "success" as const, sl: "Sucesso" },
                { n: "Relatório de Vendas - Magazine Luiza", d: "23/05/2025 08:50", r: "1.812 registros", s: "success" as const, sl: "Sucesso" },
                { n: "Relatório de Anúncios - Mercado Livre", d: "22/05/2025 17:30", r: "3.842 registros", s: "warning" as const, sl: "Avisos" },
              ].map((i) => (
                <li key={i.n} className="flex items-start gap-3">
                  <FileText className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-foreground truncate">{i.n}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center justify-between gap-2">
                      <span>{i.d}</span><span>{i.r}</span>
                    </div>
                  </div>
                  <Badge variant={i.s}>{i.sl}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function ChartBlock({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

function MarketplaceMiniCard({
  name, tone, metrics, secondary,
}: {
  name: string;
  tone: "yellow" | "blue";
  metrics: { k: string; v: string; d: string; down?: boolean }[];
  secondary: { k: string; v: string; d: string; down?: boolean }[];
}) {
  const headerBg = tone === "yellow" ? "bg-brand-yellow/15" : "bg-info/10";
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className={`px-4 py-3 ${headerBg} flex items-center justify-between`}>
        <span className="font-bold text-sm text-foreground">{name}</span>
        <span className="text-[11px] text-muted-foreground">Últimos 7 dias</span>
      </div>
      <div className="grid grid-cols-4 gap-2 p-4 border-b border-border">
        {metrics.map((m) => (
          <div key={m.k}>
            <div className="text-[10px] text-muted-foreground">{m.k}</div>
            <div className="text-sm font-bold text-foreground mt-0.5">{m.v}</div>
            <div className={`text-[10px] font-semibold ${m.down ? "text-danger" : "text-success"}`}>{m.d}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 p-4">
        {secondary.map((m) => (
          <div key={m.k}>
            <div className="text-[10px] text-muted-foreground leading-tight">{m.k}</div>
            <div className="text-sm font-bold text-foreground mt-0.5">{m.v}</div>
            <div className={`text-[10px] font-semibold ${m.down ? "text-danger" : "text-success"}`}>{m.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriorityCard({ title, tone, badge, items }: { title: string; tone: "danger" | "warning" | "success"; badge: string; items: string[] }) {
  const toneBg = tone === "danger" ? "bg-danger/5 border-danger/30" : tone === "warning" ? "bg-warning/10 border-warning/40" : "bg-success/5 border-success/30";
  const toneBadge = tone === "danger" ? "bg-danger text-danger-foreground" : tone === "warning" ? "bg-warning text-warning-foreground" : "bg-success text-success-foreground";
  return (
    <div className={`rounded-lg border ${toneBg} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-sm text-foreground">{title}</span>
        <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded ${toneBadge}`}>{badge}</span>
      </div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <AlertCircle className="size-3.5 text-muted-foreground" />
              {i}
            </span>
            <button className="text-xs text-info font-medium hover:underline">Ver</button>
          </li>
        ))}
      </ul>
      <button className="mt-3 w-full text-xs text-muted-foreground font-medium flex items-center justify-center gap-1 hover:text-foreground">
        Ver todas as {tone === "success" ? "oportunidades" : "prioridades"} <ChevronRight className="size-3" />
      </button>
    </div>
  );
}
