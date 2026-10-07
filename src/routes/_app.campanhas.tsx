import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import {
  DollarSign, TrendingUp, Target, Percent, MousePointerClick, ShoppingCart,
  Activity, Sparkles, Upload, Bot, AlertTriangle, CheckCircle2, XCircle,
  ArrowUp, ArrowDown, Send, Eye, MousePointer, Zap, Receipt, FileSpreadsheet,
  FileImage, FileText, Loader2, ChevronRight, Lightbulb, PauseCircle,
  PlayCircle, BarChart3,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge } from "@/components/ui-panels";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CampaignFileAnalysis, buildSheet, type SheetData } from "@/components/CampaignFileAnalysis";

export const Route = createFileRoute("/_app/campanhas")({
  head: () => ({ meta: [{ title: "Campanhas — Analista IA — Operações ADB" }] }),
  component: CampanhasPage,
});

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtBRL2 = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

type CampaignRow = {
  nome: string;
  produto: string;
  investimento: number;
  receita: number;
  roas: number;
  acos: number;
  conversao: number;
  ctr: number;
  cpc: number;
  status: "Promotor" | "Neutro" | "Detrator";
  health: number;
  scale: number;
};

const CAMPAIGNS: CampaignRow[] = [
  { nome: "Fone Bluetooth XYZ", produto: "Fone Bluetooth XYZ", investimento: 25430, receita: 254300, roas: 10.0, acos: 2.4, conversao: 3.45, ctr: 3.8, cpc: 0.42, status: "Promotor", health: 92, scale: 95 },
  { nome: "Smartwatch ABC", produto: "Smartwatch ABC", investimento: 18600, receita: 94860, roas: 5.1, acos: 3.85, conversao: 2.8, ctr: 2.9, cpc: 0.58, status: "Neutro", health: 72, scale: 64 },
  { nome: "Carregador Turbo", produto: "Carregador Turbo", investimento: 12150, receita: 28980, roas: 2.38, acos: 8.2, conversao: 1.25, ctr: 1.7, cpc: 0.71, status: "Detrator", health: 48, scale: 22 },
  { nome: "Capa Anti Impacto", produto: "Capa Anti Impacto", investimento: 9800, receita: 14120, roas: 1.44, acos: 12.6, conversao: 0.95, ctr: 1.4, cpc: 0.82, status: "Detrator", health: 32, scale: 14 },
  { nome: "Suporte Veicular", produto: "Suporte Veicular", investimento: 8750, receita: 56180, roas: 6.42, acos: 2.1, conversao: 3.8, ctr: 3.2, cpc: 0.39, status: "Promotor", health: 88, scale: 86 },
  { nome: "Película Premium", produto: "Película Premium", investimento: 6420, receita: 7100, roas: 1.1, acos: 14.8, conversao: 0.7, ctr: 1.1, cpc: 0.95, status: "Detrator", health: 28, scale: 8 },
  { nome: "Cabo Tipo C", produto: "Cabo Tipo C", investimento: 4200, receita: 26800, roas: 6.38, acos: 2.3, conversao: 3.6, ctr: 3.4, cpc: 0.36, status: "Promotor", health: 84, scale: 78 },
];

function CampanhasPage() {
  const [marketplace, setMarketplace] = useState("ml");
  const [periodo, setPeriodo] = useState("7d");

  return (
    <>
      <TopBar
        title="Campanhas — Analista IA"
        subtitle="Análise inteligente de campanhas patrocinadas"
        right={
          <div className="flex items-center gap-2">
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">🛒 Mercado Livre</SelectItem>
                <SelectItem value="mg">🛍️ Magazine Luiza</SelectItem>
                <SelectItem value="ambos">Ambos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Tabs defaultValue="visao" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="visao">Visão Geral</TabsTrigger>
            <TabsTrigger value="anuncios">Análise de Anúncios</TabsTrigger>
            <TabsTrigger value="diagnostico">Diagnóstico IA</TabsTrigger>
            <TabsTrigger value="plano">Plano de Ação</TabsTrigger>
            <TabsTrigger value="simulador">Simulador</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>
          <ImportButtons />
        </div>

        <TabsContent value="visao" className="space-y-4"><VisaoGeral /></TabsContent>
        <TabsContent value="anuncios" className="space-y-4"><AnalisesAnuncios /></TabsContent>
        <TabsContent value="diagnostico" className="space-y-4"><DiagnosticoIA /></TabsContent>
        <TabsContent value="plano" className="space-y-4"><PlanoAcao /></TabsContent>
        <TabsContent value="simulador" className="space-y-4"><Simulador /></TabsContent>
        <TabsContent value="historico" className="space-y-4"><Historico /></TabsContent>
      </Tabs>
    </>
  );
}

function ImportButtons() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<SheetData[] | null>(null);
  const [open, setOpen] = useState(false);

  const onPick = () => inputRef.current?.click();
  const runAnalysis = async (f: File) => {
    setAnalyzing(true);
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(await f.arrayBuffer(), { type: "array", cellDates: true });
      const sheets = wb.SheetNames.map((name) =>
        buildSheet(name, XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[name], { header: 1, defval: "", raw: true })),
      ).filter((s) => s.rows.length > 0);
      if (!sheets.length) { toast.error("A planilha está vazia."); return; }
      setResult(sheets);
      setOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível ler o arquivo. Envie um Excel (.xlsx/.xls) ou CSV.");
    } finally {
      setAnalyzing(false);
    }
  };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setFile(f);
    if (/\.(xlsx|xls|csv)$/i.test(f.name)) runAnalysis(f);
  };
  const analyze = () => {
    if (!file) { toast.info("Envie primeiro uma planilha de campanhas."); onPick(); return; }
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) { toast.error("A análise automática funciona com Excel ou CSV."); return; }
    runAnalysis(file);
  };

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" hidden accept=".xlsx,.xls,.csv,.png,.jpg,.jpeg,.pdf" onChange={onFile} />
      <Button variant="outline" size="sm" onClick={onPick}>
        <Upload className="size-3.5 mr-1.5" />
        {file ? <span className="max-w-[160px] truncate">{file.name}</span> : "Upload de arquivo"}
      </Button>
      <Button size="sm" onClick={analyze} disabled={analyzing} className="bg-info hover:bg-info/90 text-info-foreground">
        {analyzing ? <Loader2 className="size-3.5 mr-1.5 animate-spin" /> : <Sparkles className="size-3.5 mr-1.5" />}
        {analyzing ? "Analisando..." : "Analisar com IA"}
      </Button>
      {result && file && (
        <CampaignFileAnalysis open={open} onOpenChange={setOpen} fileName={file.name} sheets={result} />
      )}
    </div>
  );
}

// ============ BLOCO 1: KPIs ============
function KpiCard({
  label, value, delta, trend, icon, color,
}: { label: string; value: string; delta?: string; trend?: "up" | "down"; icon: React.ReactNode; color: string }) {
  const trendColor = trend === "down" ? "text-danger" : "text-success";
  const TrendIcon = trend === "down" ? ArrowDown : ArrowUp;
  return (
    <div className="rounded-xl bg-card border border-border p-4 shadow-sm flex flex-col items-center text-center">
      <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div className="text-xs font-medium text-muted-foreground mt-2">{label}</div>
      <div className="text-xl font-bold text-foreground mt-0.5 truncate max-w-full">{value}</div>
      {delta ? (
        <div className={`flex items-center justify-center gap-1 text-xs font-semibold mt-1 ${trendColor}`}>
          <TrendIcon className="size-3" />
          {delta}
          <span className="text-muted-foreground font-normal">vs período anterior</span>
        </div>
      ) : null}
    </div>
  );
}

function HealthScoreCard({ score, label = "Excelente", delta = "+8 pts" }: { score: number; label?: string; delta?: string }) {
  const angle = (score / 100) * 180;
  return (
    <div className="rounded-xl bg-card border border-border p-4 shadow-sm flex flex-col items-center">
      <div className="text-xs font-semibold text-muted-foreground mb-2">Campaign Health Score</div>
      <div className="relative w-40 h-20 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full bg-gradient-to-r from-danger via-warning to-success" />
        <div className="absolute inset-1 bg-card rounded-t-full" />
        <div
          className="absolute bottom-0 left-1/2 origin-bottom h-[72px] w-0.5 bg-foreground"
          style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-3 rounded-full bg-foreground" />
      </div>
      <div className="text-3xl font-bold text-foreground mt-1">{score}</div>
      <div className="text-xs font-semibold text-success">{label}</div>
      <div className="text-[11px] text-muted-foreground mt-1">↑ {delta} vs período anterior</div>
    </div>
  );
}

function VisaoGeral() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard label="Investimento" value={fmtBRL(180250)} delta="+18,7%" trend="up" icon={<DollarSign className="size-5" />} color="bg-success/15 text-success" />
          <KpiCard label="Receita" value={fmtBRL(1089430)} delta="+22,5%" trend="up" icon={<Receipt className="size-5" />} color="bg-brand-yellow/20 text-brand-orange" />
          <KpiCard label="ROAS" value="6,05" delta="+12,4%" trend="up" icon={<TrendingUp className="size-5" />} color="bg-purple-500/15 text-purple-500" />
          <KpiCard label="ACOS" value="4,82%" delta="-1,2 p.p." trend="up" icon={<Target className="size-5" />} color="bg-danger/15 text-danger" />
          <KpiCard label="TACOS" value="7,31%" delta="+0,6 p.p." trend="down" icon={<Activity className="size-5" />} color="bg-info/15 text-info" />
          <KpiCard label="Conversão" value="2,62%" delta="-0,4 p.p." trend="down" icon={<Percent className="size-5" />} color="bg-cyan-500/15 text-cyan-500" />
        </div>
        <HealthScoreCard score={85} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KpiCard label="CPC Médio" value={fmtBRL2(0.52)} delta="-3,1%" trend="up" icon={<MousePointerClick className="size-5" />} color="bg-info/15 text-info" />
        <KpiCard label="CTR Médio" value="2,60%" delta="+0,4 p.p." trend="up" icon={<MousePointer className="size-5" />} color="bg-success/15 text-success" />
        <KpiCard label="Vendas Atribuídas" value="2.213" delta="+18,0%" trend="up" icon={<ShoppingCart className="size-5" />} color="bg-brand-yellow/20 text-brand-orange" />
        <KpiCard label="Campanhas Ativas" value="23" delta="+2" trend="up" icon={<Zap className="size-5" />} color="bg-purple-500/15 text-purple-500" />
        <KpiCard label="Scale Score Médio" value="68" delta="+5 pts" trend="up" icon={<BarChart3 className="size-5" />} color="bg-cyan-500/15 text-cyan-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Resumo Inteligente (IA)" className="lg:col-span-2">
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-md bg-danger/20 flex items-center justify-center"><AlertTriangle className="size-4 text-danger" /></div>
                <span className="font-semibold text-foreground">Problema principal detectado</span>
              </div>
              <Badge variant="warning">Conversão abaixo do ideal</Badge>
            </div>
            <div className="text-sm text-foreground">
              Impacto estimado: <span className="font-bold text-danger">-R$ 45.300</span> em receita nos últimos 7 dias
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">O que aconteceu?</div>
              <p className="text-sm">A conversão caiu para <b>2,62%</b> (-18%).</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Por que aconteceu?</div>
              <p className="text-sm">CTR está saudável (2,60%), mas a conversão caiu.</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">Como resolver?</div>
              <p className="text-sm">Revisar imagem, preço, oferta e avaliação do produto.</p>
            </div>
          </div>
          <div className="mt-3 text-right">
            <Button variant="link" size="sm" className="text-info">Ver diagnóstico completo <ChevronRight className="size-3.5 ml-0.5" /></Button>
          </div>
        </Panel>

        <Panel title="Distribuição do Investimento">
          <div className="flex items-center gap-4">
            <DonutChart segments={[
              { value: 50, color: "bg-purple-500", label: "Top 20% Produtos" },
              { value: 37, color: "bg-info", label: "Intermediários" },
              { value: 13, color: "bg-brand-yellow", label: "Baixo retorno" },
            ]} centerLabel={fmtBRL(180250)} centerSub="Total" />
            <div className="flex-1 space-y-2 text-xs">
              <LegendRow color="bg-purple-500" label="Top 20% Produtos" value={`${fmtBRL(90120)} (50%)`} />
              <LegendRow color="bg-info" label="Intermediários" value={`${fmtBRL(67430)} (37%)`} />
              <LegendRow color="bg-brand-yellow" label="Baixo retorno" value={`${fmtBRL(22700)} (13%)`} />
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Funil de Performance">
        <Funnel />
        <div className="mt-3 flex items-center gap-2 text-xs justify-center">
          <span className="text-muted-foreground">Gargalo identificado:</span>
          <Badge variant="warning">Conversão</Badge>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Desempenho por Campanha" className="lg:col-span-2">
          <CampaignTable />
        </Panel>
        <div className="space-y-4">
          <TopScale />
          <TopPause />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PositivosNegativos />
        <AssistenteIA />
      </div>
    </>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className={`size-2 rounded-full ${color}`} />
        <span className="text-foreground truncate">{label}</span>
      </div>
      <span className="text-muted-foreground tabular-nums">{value}</span>
    </div>
  );
}

function DonutChart({ segments, centerLabel, centerSub }: { segments: { value: number; color: string; label: string }[]; centerLabel: string; centerSub: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const radius = 36;
  const c = 2 * Math.PI * radius;
  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 100 100" className="-rotate-90 size-full">
        <circle cx="50" cy="50" r={radius} className="fill-none stroke-muted" strokeWidth="14" />
        {segments.map((s, i) => {
          const dash = (s.value / total) * c;
          const el = (
            <circle
              key={i}
              cx="50" cy="50" r={radius}
              className={`fill-none ${s.color.replace("bg-", "stroke-")}`}
              strokeWidth="14"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-sm font-bold">{centerLabel}</div>
        <div className="text-[10px] text-muted-foreground">{centerSub}</div>
      </div>
    </div>
  );
}

function Funnel() {
  const steps = [
    { label: "Impressões", value: "3,25M", delta: "+14,3%", trend: "up" as const, icon: <Eye className="size-5" /> },
    { label: "Cliques", value: "84.550", delta: "+11,2%", trend: "up" as const, icon: <MousePointer className="size-5" /> },
    { label: "CTR", value: "2,60%", delta: "+0,4 p.p.", trend: "up" as const, icon: <Percent className="size-5" /> },
    { label: "Conversões", value: "2.213", delta: "-18,0%", trend: "down" as const, icon: <ShoppingCart className="size-5" />, bottleneck: true },
    { label: "Receita", value: fmtBRL(1089430), delta: "+22,5%", trend: "up" as const, icon: <DollarSign className="size-5" /> },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {steps.map((s) => (
        <div key={s.label} className={`rounded-lg border p-3 text-center ${s.bottleneck ? "border-danger/40 bg-danger/5" : "border-border bg-card"}`}>
          <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
          <div className={`mx-auto mt-2 size-12 rounded-lg flex items-center justify-center ${s.bottleneck ? "bg-danger/15 text-danger" : "bg-info/15 text-info"}`}>
            {s.icon}
          </div>
          <div className="text-lg font-bold mt-2">{s.value}</div>
          <div className={`text-[11px] font-semibold flex items-center justify-center gap-1 ${s.trend === "down" ? "text-danger" : "text-success"}`}>
            {s.trend === "down" ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" />} {s.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ s }: { s: CampaignRow["status"] }) {
  const map = { Promotor: "success", Neutro: "warning", Detrator: "danger" } as const;
  return <Badge variant={map[s]}>{s}</Badge>;
}

function HealthPill({ v }: { v: number }) {
  const color = v >= 80 ? "bg-success" : v >= 60 ? "bg-warning" : "bg-danger";
  return <span className={`inline-flex items-center justify-center min-w-9 px-2 h-6 rounded-full text-xs font-bold text-white ${color}`}>{v}</span>;
}

function CampaignTable() {
  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted-foreground border-b border-border">
            <th className="px-5 py-2 font-medium">Campanha</th>
            <th className="px-3 py-2 font-medium text-right">Investimento</th>
            <th className="px-3 py-2 font-medium text-right">Receita</th>
            <th className="px-3 py-2 font-medium text-right">ROAS</th>
            <th className="px-3 py-2 font-medium text-right">ACOS</th>
            <th className="px-3 py-2 font-medium text-right">Conversão</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-5 py-2 font-medium text-center">Health</th>
          </tr>
        </thead>
        <tbody>
          {CAMPAIGNS.slice(0, 5).map((r) => (
            <tr key={r.nome} className="border-b border-border/50 hover:bg-muted/40">
              <td className="px-5 py-2 font-medium">{r.nome}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmtBRL(r.investimento)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{fmtBRL(r.receita)}</td>
              <td className="px-3 py-2 text-right tabular-nums font-semibold">{r.roas.toFixed(2)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.acos.toFixed(2)}%</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.conversao.toFixed(2)}%</td>
              <td className="px-3 py-2"><StatusBadge s={r.status} /></td>
              <td className="px-5 py-2 text-center"><HealthPill v={r.health} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-5 pt-3 text-right">
        <Button variant="link" size="sm" className="text-info">Ver todas as campanhas ({CAMPAIGNS.length}) <ChevronRight className="size-3.5 ml-0.5" /></Button>
      </div>
    </div>
  );
}

function TopScale() {
  const items = [
    { nome: "Fone Bluetooth XYZ", potencial: "+R$ 78.500/mês", icon: "🎧" },
    { nome: "Suporte Veicular", potencial: "+R$ 32.200/mês", icon: "📱" },
    { nome: "Cabo Tipo C", potencial: "+R$ 18.900/mês", icon: "🔌" },
  ];
  return (
    <Panel title={<span className="flex items-center gap-1.5"><PlayCircle className="size-4 text-success" /> Top Oportunidades de Escala</span> as unknown as string}>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.nome} className="flex items-center gap-3">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center text-base">{i.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{i.nome}</div>
              <div className="text-xs text-success font-medium">Potencial: {i.potencial}</div>
            </div>
            <Button variant="outline" size="sm">Ver</Button>
          </div>
        ))}
        <Button variant="link" size="sm" className="text-info w-full">Ver todas oportunidades <ChevronRight className="size-3.5 ml-0.5" /></Button>
      </div>
    </Panel>
  );
}

function TopPause() {
  const items = [
    { nome: "Capa Anti Impacto", perda: "-R$ 12.300/mês", icon: "📱" },
    { nome: "Carregador Turbo", perda: "-R$ 9.800/mês", icon: "🔋" },
    { nome: "Película Premium", perda: "-R$ 6.400/mês", icon: "🛡️" },
  ];
  return (
    <Panel title={<span className="flex items-center gap-1.5"><PauseCircle className="size-4 text-danger" /> Top Para Pausar</span> as unknown as string}>
      <div className="space-y-3">
        {items.map((i, idx) => (
          <div key={i.nome} className="flex items-center gap-3">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center text-base">{idx + 1}. {i.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{i.nome}</div>
              <div className="text-xs text-danger font-medium">Perda estimada: {i.perda}</div>
            </div>
            <Button variant="outline" size="sm">Ver</Button>
          </div>
        ))}
        <Button variant="link" size="sm" className="text-info w-full">Ver todas para pausar <ChevronRight className="size-3.5 ml-0.5" /></Button>
      </div>
    </Panel>
  );
}

function PositivosNegativos() {
  const pos = ["ROAS acima da meta (6,05 vs 5,0)", "Crescimento de receita +22,5%", "ACOS controlado em 4,82%", "CTR saudável em 2,60%"];
  const neg = ["TACOS subiu 0,6 p.p.", "Conversão caiu 18%", "CPC do Carregador Turbo elevado", "3 anúncios com baixo retorno"];
  return (
    <Panel title="Pontos Positivos & Atenção">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold text-success mb-2">✅ Pontos Positivos</div>
          <ul className="space-y-2 text-sm">
            {pos.map((p) => (
              <li key={p} className="flex gap-2"><CheckCircle2 className="size-4 text-success shrink-0 mt-0.5" /><span>{p}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-warning-foreground mb-2">⚠️ Pontos de Atenção</div>
          <ul className="space-y-2 text-sm">
            {neg.map((n) => (
              <li key={n} className="flex gap-2"><AlertTriangle className="size-4 text-warning-foreground shrink-0 mt-0.5" /><span>{n}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

// ============ ASSISTENTE IA ============
function AssistenteIA() {
  const suggestions = ["Onde devo investir mais?", "Qual campanha devo pausar?", "Por que meu TACOS aumentou?", "Como melhorar meu ROAS?"];
  const [input, setInput] = useState("");
  return (
    <Panel title={<span className="flex items-center gap-1.5"><Bot className="size-4 text-info" /> Assistente IA</span> as unknown as string}>
      <div className="space-y-3">
        <div className="rounded-lg bg-muted/50 p-3 text-sm">Olá! Em que posso ajudar?</div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} className="text-xs rounded-full border border-border bg-card hover:bg-accent px-3 py-1.5" onClick={() => setInput(s)}>{s}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input placeholder="Pergunte algo..." value={input} onChange={(e) => setInput(e.target.value)} />
          <Button size="icon" className="bg-info hover:bg-info/90 text-info-foreground"><Send className="size-4" /></Button>
        </div>
      </div>
    </Panel>
  );
}

// ============ ANÚNCIOS ============
function AnalisesAnuncios() {
  return (
    <Panel title="Análise por Anúncio">
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-2 font-medium">Produto</th>
              <th className="px-3 py-2 font-medium text-right">Investimento</th>
              <th className="px-3 py-2 font-medium text-right">Receita</th>
              <th className="px-3 py-2 font-medium text-right">ROAS</th>
              <th className="px-3 py-2 font-medium text-right">ACOS</th>
              <th className="px-3 py-2 font-medium text-right">CTR</th>
              <th className="px-3 py-2 font-medium text-right">CPC</th>
              <th className="px-3 py-2 font-medium text-right">Conversão</th>
              <th className="px-5 py-2 font-medium">Classificação</th>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((r) => (
              <tr key={r.nome} className="border-b border-border/50 hover:bg-muted/40">
                <td className="px-5 py-2 font-medium">{r.produto}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtBRL(r.investimento)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtBRL(r.receita)}</td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">{r.roas.toFixed(2)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.acos.toFixed(2)}%</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.ctr.toFixed(2)}%</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmtBRL2(r.cpc)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.conversao.toFixed(2)}%</td>
                <td className="px-5 py-2"><StatusBadge s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ============ DIAGNÓSTICO ============
function DiagnosticoIA() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <DiagCard color="danger" title="🔴 Conversão Baixa" desc="2,62% — abaixo da meta (3,2%)" />
        <DiagCard color="warning" title="🔴 ACOS Elevado em 3 anúncios" desc="Capa Anti Impacto, Carregador Turbo, Película Premium" />
        <DiagCard color="warning" title="🔴 CTR Baixo em 4 produtos" desc="Imagens e títulos precisam revisão" />
      </div>

      <Panel title="Root Cause AI — Análise de Causa Raiz">
        <div className="space-y-4">
          <RootCause
            problema="ACOS do Carregador Turbo subiu para 8,2%"
            oque="ACOS subiu 3,1 p.p. nas últimas 2 semanas, consumindo R$ 9.800 sem retorno."
            por="CTR caiu 32% após mudança da imagem principal. Concorrentes baixaram preço em 12%."
            como="1) Restaurar imagem original ou testar nova versão. 2) Ajustar preço para competitividade. 3) Reduzir lance em 20%."
          />
          <RootCause
            problema="Conversão geral caiu 18%"
            oque="Conversão geral em 2,62% (vs 3,2% no período anterior). Receita perdida ≈ R$ 45.300."
            por="CTR está saudável (2,60%), o tráfego chega bem — perda ocorre na página do produto. 3 produtos com avaliações novas <4 estrelas."
            como="Revisar avaliações negativas, melhorar fotos secundárias, testar preço promocional em SKUs prioritários."
          />
        </div>
      </Panel>

      <Panel title="Funil de Performance"><Funnel /></Panel>
    </>
  );
}

function DiagCard({ color, title, desc }: { color: "danger" | "warning"; title: string; desc: string }) {
  return (
    <div className={`rounded-lg border p-4 ${color === "danger" ? "border-danger/30 bg-danger/5" : "border-warning/30 bg-warning/5"}`}>
      <div className="text-sm font-semibold mb-1">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

function RootCause({ problema, oque, por, como }: { problema: string; oque: string; por: string; como: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="size-4 text-warning-foreground" />
        <div className="font-semibold text-sm">{problema}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div><div className="text-xs font-semibold text-muted-foreground mb-1">O que aconteceu?</div><p>{oque}</p></div>
        <div><div className="text-xs font-semibold text-muted-foreground mb-1">Por que aconteceu?</div><p>{por}</p></div>
        <div><div className="text-xs font-semibold text-muted-foreground mb-1">Como resolver?</div><p>{como}</p></div>
      </div>
    </div>
  );
}

// ============ PLANO DE AÇÃO ============
function PlanoAcao() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <PlanColumn
        title="Alta Prioridade"
        color="danger"
        items={[
          "Revisar anúncio da Capa Anti Impacto",
          "Reduzir 50% do orçamento do Carregador Turbo",
          "Ajustar preço do Smartwatch ABC",
        ]}
      />
      <PlanColumn
        title="Média Prioridade"
        color="warning"
        items={[
          "Melhorar imagem do Carregador Turbo",
          "Aumentar 20% do orçamento do Fone Bluetooth XYZ",
          "Revisar títulos dos produtos detratores",
        ]}
      />
      <PlanColumn
        title="Oportunidades"
        color="success"
        items={[
          "Criar variações de anúncio do Suporte Veicular",
          "Testar nova imagem do Fone Bluetooth XYZ",
          "Escalar campanha do Cabo Tipo C",
        ]}
      />
    </div>
  );
}

function PlanColumn({ title, color, items }: { title: string; color: "danger" | "warning" | "success"; items: string[] }) {
  const c =
    color === "danger" ? "border-danger/30 bg-danger/5" :
    color === "warning" ? "border-warning/30 bg-warning/5" : "border-success/30 bg-success/5";
  const dotC = color === "danger" ? "bg-danger" : color === "warning" ? "bg-warning" : "bg-success";
  return (
    <Panel>
      <div className={`rounded-lg border p-4 ${c}`}>
        <div className="font-semibold text-sm mb-3">{title}</div>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i} className="flex items-start gap-2"><span className={`size-1.5 rounded-full mt-2 shrink-0 ${dotC}`} />{i}</li>
          ))}
        </ul>
      </div>
      <div className="text-right mt-3"><Button variant="link" size="sm" className="text-info">Ver plano completo <ChevronRight className="size-3.5 ml-0.5" /></Button></div>
    </Panel>
  );
}

// ============ SIMULADOR ============
function Simulador() {
  const [acao, setAcao] = useState("aumentar");
  const [produto, setProduto] = useState(CAMPAIGNS[0].nome);
  const [pct, setPct] = useState([20]);
  const camp = CAMPAIGNS.find((c) => c.nome === produto)!;
  const fator = pct[0] / 100;
  const invDelta = camp.investimento * fator;
  const recDelta = invDelta * camp.roas * 0.85;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Panel title="Simulador de Impacto Financeiro" className="lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Escolha uma ação</label>
            <Select value={acao} onValueChange={setAcao}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aumentar">Aumentar orçamento</SelectItem>
                <SelectItem value="pausar">Pausar anúncio</SelectItem>
                <SelectItem value="reduzir">Reduzir investimento</SelectItem>
                <SelectItem value="meta">Atingir ROAS 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Produto / Campanha</label>
            <Select value={produto} onValueChange={setProduto}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMPAIGNS.map((c) => <SelectItem key={c.nome} value={c.nome}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-muted-foreground">Variação (%)</span>
            <span className="font-semibold">{pct[0]}%</span>
          </div>
          <Slider value={pct} onValueChange={setPct} min={0} max={100} step={5} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <SimCard label="Investimento" value={`+${fmtBRL(invDelta)}`} />
          <SimCard label="Receita Estimada" value={`+${fmtBRL(recDelta)}`} positive />
          <SimCard label="ROAS Projetado" value={(camp.roas * 0.92).toFixed(2)} />
        </div>
        <div className="mt-4 rounded-lg border border-info/30 bg-info/5 p-3 text-sm">
          <b>Projeção IA:</b> Se aumentar {pct[0]}% do orçamento de <b>{produto}</b>, o potencial estimado é gerar <b>+{fmtBRL(recDelta)}</b> em receita no próximo período.
        </div>
      </Panel>

      <ScalePanel />
    </div>
  );
}

function SimCard({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold mt-1 ${positive ? "text-success" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function ScalePanel() {
  return (
    <Panel title="Scale Score — Potencial de Escala">
      <div className="space-y-3">
        {CAMPAIGNS.slice(0, 5).map((c) => (
          <div key={c.nome}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium truncate">{c.nome}</span>
              <span className={`font-bold ${c.scale >= 70 ? "text-success" : c.scale >= 40 ? "text-warning-foreground" : "text-danger"}`}>{c.scale}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full ${c.scale >= 70 ? "bg-success" : c.scale >= 40 ? "bg-warning" : "bg-danger"}`} style={{ width: `${c.scale}%` }} />
            </div>
          </div>
        ))}
        <div className="flex gap-2 pt-2 text-[11px] text-muted-foreground">
          <Badge variant="success">🟢 Escalar</Badge>
          <Badge variant="warning">🟡 Monitorar</Badge>
          <Badge variant="danger">🔴 Não investir</Badge>
        </div>
      </div>
    </Panel>
  );
}

// ============ HISTÓRICO ============
function Historico() {
  const periods = [
    { p: "Últimos 7 dias", roas: 6.05, acos: 4.82, tacos: 7.31, receita: 1089430, inv: 180250, conv: 2.62 },
    { p: "Semana anterior", roas: 5.38, acos: 6.02, tacos: 6.71, receita: 889120, inv: 151800, conv: 3.20 },
    { p: "Há 2 semanas", roas: 5.12, acos: 6.41, tacos: 6.54, receita: 824300, inv: 161100, conv: 3.05 },
    { p: "Há 3 semanas", roas: 4.92, acos: 6.78, tacos: 6.91, receita: 762100, inv: 154900, conv: 2.88 },
  ];
  return (
    <>
      <Panel title="Histórico de Análises">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-2 font-medium">Período</th>
                <th className="px-3 py-2 font-medium text-right">ROAS</th>
                <th className="px-3 py-2 font-medium text-right">ACOS</th>
                <th className="px-3 py-2 font-medium text-right">TACOS</th>
                <th className="px-3 py-2 font-medium text-right">Conversão</th>
                <th className="px-3 py-2 font-medium text-right">Investimento</th>
                <th className="px-5 py-2 font-medium text-right">Receita</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((r) => (
                <tr key={r.p} className="border-b border-border/50 hover:bg-muted/40">
                  <td className="px-5 py-2 font-medium">{r.p}</td>
                  <td className="px-3 py-2 text-right tabular-nums font-semibold">{r.roas.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.acos.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.tacos.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.conv.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmtBRL(r.inv)}</td>
                  <td className="px-5 py-2 text-right tabular-nums">{fmtBRL(r.receita)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Benchmark Interno (IA)">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><BarChart3 className="size-4 text-info shrink-0 mt-0.5" /> Esta campanha possui ROAS <b>6,05</b>. Sua média histórica é <b>5,37</b> — <span className="text-success font-semibold">+12,6%</span>.</li>
          <li className="flex gap-2"><BarChart3 className="size-4 text-info shrink-0 mt-0.5" /> A conversão atual está <b className="text-danger">18% abaixo</b> da média da operação.</li>
          <li className="flex gap-2"><BarChart3 className="size-4 text-info shrink-0 mt-0.5" /> O produto <b>Fone Bluetooth XYZ</b> possui potencial de escala <b>acima da média</b>.</li>
        </ul>
      </Panel>

      <Panel title="Formatos suportados na importação">
        <div className="flex flex-wrap gap-2">
          <Badge variant="info"><FileImage className="size-3 mr-1 inline" />PNG / JPG (OCR)</Badge>
          <Badge variant="info"><FileText className="size-3 mr-1 inline" />PDF</Badge>
          <Badge variant="success"><FileSpreadsheet className="size-3 mr-1 inline" />XLSX</Badge>
          <Badge variant="success"><FileSpreadsheet className="size-3 mr-1 inline" />CSV</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-3">A IA extrai automaticamente: nome da campanha, produto, investimento, impressões, cliques, CTR, CPC, conversões, receita, ROAS, ACOS, TACOS, ROI e vendas atribuídas.</p>
      </Panel>
    </>
  );
}
