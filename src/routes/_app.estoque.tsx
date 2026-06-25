import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Panel, MetricCard, Badge } from "@/components/ui-panels";
import { Package, AlertCircle, XCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/estoque")({
  head: () => ({ meta: [{ title: "Estoque — Operações ADB" }] }),
  component: Estoque,
});

const MARKETPLACE_OPTIONS = [
  { value: "consolidado", label: "Visão Consolidada" },
  { value: "ml", label: "Mercado Livre" },
  { value: "magalu", label: "Magazine Luiza" },
] as const;

type Marketplace = (typeof MARKETPLACE_OPTIONS)[number]["value"];

const itens = [
  { p: "Castanha de Caju 100g", s: "CJU100", ml: 120, mg: 80, st: "OK" },
  { p: "Mix de Castanhas 100g", s: "MC100", ml: 8, mg: 0, st: "Crítico" },
  { p: "Cookies Castanha 30g", s: "CCK30", ml: 45, mg: 30, st: "OK" },
  { p: "Mel Silvestre 300g", s: "MEL300", ml: 12, mg: 35, st: "Atenção" },
  { p: "Kit Presente Castanhas", s: "KIT03", ml: 0, mg: 20, st: "Ruptura" },
  { p: "Ecobag Turma da Mônica", s: "ECOBAG-MG", ml: 18, mg: 15, st: "OK" },
];

const statusVariant = { OK: "success", Atenção: "warning", Crítico: "danger", Ruptura: "danger" } as const;

const metricsByMarketplace: Record<Marketplace, { label: string; value: string; icon: React.ReactNode; iconColor: string }[]> = {
  consolidado: [
    { label: "SKUs Monitorados", value: "46", icon: <Package className="size-4" />, iconColor: "bg-info/15 text-info" },
    { label: "Estoque Crítico", value: "9", icon: <AlertCircle className="size-4" />, iconColor: "bg-warning/20 text-warning-foreground" },
    { label: "Rupturas", value: "2", icon: <XCircle className="size-4" />, iconColor: "bg-danger/15 text-danger" },
    { label: "Reposições Sugeridas", value: "14", icon: <RefreshCw className="size-4" />, iconColor: "bg-success/15 text-success" },
  ],
  ml: [
    { label: "SKUs ML", value: "46", icon: <Package className="size-4" />, iconColor: "bg-info/15 text-info" },
    { label: "Estoque Crítico ML", value: "6", icon: <AlertCircle className="size-4" />, iconColor: "bg-warning/20 text-warning-foreground" },
    { label: "Rupturas ML", value: "1", icon: <XCircle className="size-4" />, iconColor: "bg-danger/15 text-danger" },
    { label: "Reposições Sugeridas ML", value: "9", icon: <RefreshCw className="size-4" />, iconColor: "bg-success/15 text-success" },
  ],
  magalu: [
    { label: "SKUs Magazine Luiza", value: "42", icon: <Package className="size-4" />, iconColor: "bg-info/15 text-info" },
    { label: "Estoque Crítico MG", value: "5", icon: <AlertCircle className="size-4" />, iconColor: "bg-warning/20 text-warning-foreground" },
    { label: "Rupturas MG", value: "1", icon: <XCircle className="size-4" />, iconColor: "bg-danger/15 text-danger" },
    { label: "Reposições Sugeridas MG", value: "8", icon: <RefreshCw className="size-4" />, iconColor: "bg-success/15 text-success" },
  ],
};

function Estoque() {
  const [marketplace, setMarketplace] = useState<Marketplace>("consolidado");

  const subtitle = marketplace === "consolidado"
    ? "Visão consolidada de estoque por marketplace"
    : marketplace === "ml"
      ? "Visão de estoque do Mercado Livre"
      : "Visão de estoque da Magazine Luiza";

  const selector = (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Marketplace:</span>
      <select
        value={marketplace}
        onChange={(e) => setMarketplace(e.target.value as Marketplace)}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {MARKETPLACE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );

  const metrics = metricsByMarketplace[marketplace];

  return (
    <>
      <TopBar title="Estoque" subtitle={subtitle} right={selector} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconColor={m.iconColor} />
        ))}
      </div>
      <Panel title="Posição de Estoque">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="py-2">Produto</th>
              <th className="py-2">SKU</th>
              {marketplace !== "magalu" && <th className="py-2">Mercado Livre</th>}
              {marketplace !== "ml" && <th className="py-2">Magazine Luiza</th>}
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i) => (
              <tr key={i.s} className="border-b border-border last:border-0">
                <td className="py-3 font-medium">{i.p}</td>
                <td className="py-3 text-muted-foreground">{i.s}</td>
                {marketplace !== "magalu" && <td className="py-3">{i.ml} un.</td>}
                {marketplace !== "ml" && <td className="py-3">{i.mg} un.</td>}
                <td className="py-3"><Badge variant={statusVariant[i.st as keyof typeof statusVariant]}>{i.st}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
