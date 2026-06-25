import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, MetricCard, Badge } from "@/components/ui-panels";
import { Package, AlertCircle, XCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/estoque")({
  head: () => ({ meta: [{ title: "Estoque — Operações ADB" }] }),
  component: Estoque,
});

const itens = [
  { p: "Castanha de Caju 100g", s: "CJU100", ml: 120, mg: 80, st: "OK" },
  { p: "Mix de Castanhas 100g", s: "MC100", ml: 8, mg: 0, st: "Crítico" },
  { p: "Cookies Castanha 30g", s: "CCK30", ml: 45, mg: 30, st: "OK" },
  { p: "Mel Silvestre 300g", s: "MEL300", ml: 12, mg: 35, st: "Atenção" },
  { p: "Kit Presente Castanhas", s: "KIT03", ml: 0, mg: 20, st: "Ruptura" },
  { p: "Ecobag Turma da Mônica", s: "ECOBAG-MG", ml: 18, mg: 15, st: "OK" },
];

const statusVariant = { OK: "success", Atenção: "warning", Crítico: "danger", Ruptura: "danger" } as const;

function Estoque() {
  return (
    <>
      <TopBar title="Estoque" subtitle="Visão consolidada de estoque por marketplace" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard label="SKUs Monitorados" value="46" icon={<Package className="size-4" />} iconColor="bg-info/15 text-info" />
        <MetricCard label="Estoque Crítico" value="9" icon={<AlertCircle className="size-4" />} iconColor="bg-warning/20 text-warning-foreground" />
        <MetricCard label="Rupturas" value="2" icon={<XCircle className="size-4" />} iconColor="bg-danger/15 text-danger" />
        <MetricCard label="Reposições Sugeridas" value="14" icon={<RefreshCw className="size-4" />} iconColor="bg-success/15 text-success" />
      </div>
      <Panel title="Posição de Estoque">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="py-2">Produto</th><th className="py-2">SKU</th><th className="py-2">Mercado Livre</th><th className="py-2">Magazine Luiza</th><th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i) => (
              <tr key={i.s} className="border-b border-border last:border-0">
                <td className="py-3 font-medium">{i.p}</td>
                <td className="py-3 text-muted-foreground">{i.s}</td>
                <td className="py-3">{i.ml} un.</td>
                <td className="py-3">{i.mg} un.</td>
                <td className="py-3"><Badge variant={statusVariant[i.st as keyof typeof statusVariant]}>{i.st}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
