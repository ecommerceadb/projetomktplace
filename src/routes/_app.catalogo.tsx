import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, MetricCard, Badge } from "@/components/ui-panels";
import { Package, AlertCircle, XCircle, Filter, Download } from "lucide-react";

export const Route = createFileRoute("/_app/catalogo")({
  head: () => ({ meta: [{ title: "Catálogo de Produtos — Operações ADB" }] }),
  component: Catalogo,
});

const produtos = [
  { p: "Castanha de Caju 100g", s: "CJU100", c: "Castanhas", mlP: "R$ 20,90", mlE: "120 un.", mlV: "1.856", mgP: "R$ 18,90", mgE: "80 un.", mgV: "1.102", seo: 92, cad: 88, st: "Ativo" },
  { p: "Mix de Castanhas 100g", s: "MC100", c: "Castanhas", mlP: "R$ 22,90", mlE: "90 un.", mlV: "1.245", mgP: "R$ 20,90", mgE: "60 un.", mgV: "823", seo: 88, cad: 85, st: "Ativo" },
  { p: "Cookies Castanha 30g", s: "CCK30", c: "Cookies", mlP: "R$ 6,90", mlE: "45 un.", mlV: "642", mgP: "R$ 6,50", mgE: "30 un.", mgV: "512", seo: 74, cad: 71, st: "Ativo" },
  { p: "Mel Silvestre 300g", s: "MEL300", c: "Mel", mlP: "R$ 35,90", mlE: "45 un.", mlV: "368", mgP: "R$ 32,90", mgE: "35 un.", mgV: "298", seo: 90, cad: 86, st: "Ativo" },
  { p: "Kit Presente Castanhas", s: "KIT03", c: "Kits", mlP: "R$ 65,00", mlE: "25 un.", mlV: "312", mgP: "R$ 58,90", mgE: "20 un.", mgV: "210", seo: 80, cad: 83, st: "Ativo" },
  { p: "Ecobag Turma da Mônica", s: "ECOBAG-MG", c: "Merchandising", mlP: "R$ 29,90", mlE: "18 un.", mlV: "215", mgP: "R$ 27,90", mgE: "15 un.", mgV: "164", seo: 78, cad: 75, st: "Ativo" },
  { p: "Caneca Cordel", s: "CANC-COR", c: "Merchandising", mlP: "R$ 26,90", mlE: "18 un.", mlV: "198", mgP: "R$ 24,90", mgE: "18 un.", mgV: "143", seo: 76, cad: 79, st: "Ativo" },
];

function scoreColor(n: number) {
  if (n >= 85) return "bg-success/20 text-success";
  if (n >= 70) return "bg-warning/20 text-warning-foreground";
  return "bg-danger/15 text-danger";
}

function Catalogo() {
  return (
    <>
      <TopBar title="Catálogo de Produtos" subtitle="Visão completa de todos os produtos e seu desempenho por marketplace." />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-sm text-muted-foreground">Marketplace:</span>
        <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
          <button className="rounded px-3 py-1.5 bg-card font-semibold shadow-sm">Todos</button>
          <button className="rounded px-3 py-1.5 text-muted-foreground">Mercado Livre</button>
          <button className="rounded px-3 py-1.5 text-muted-foreground">Magalu</button>
        </div>
        <input placeholder="Buscar produto, SKU ou EAN..." className="flex-1 min-w-[200px] rounded-md border border-border bg-card px-3 py-2 text-sm" />
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"><Filter className="size-4" /> Filtros</button>
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm"><Download className="size-4" /> Exportar</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <MetricCard label="Total de SKUs" value="46" hint="ativos" icon={<Package className="size-4" />} iconColor="bg-info/15 text-info" />
        <MetricCard label="Apenas ML" value="18" hint="SKUs" icon={<Package className="size-4" />} iconColor="bg-brand-yellow/25 text-brand-orange" />
        <MetricCard label="Apenas Magalu" value="12" hint="SKUs" icon={<Package className="size-4" />} iconColor="bg-info/15 text-info" />
        <MetricCard label="Em Ambos" value="16" hint="SKUs" icon={<Package className="size-4" />} iconColor="bg-brand-navy/10 text-brand-navy" />
        <MetricCard label="Com Estoque Baixo" value="9" hint="SKUs" icon={<AlertCircle className="size-4" />} iconColor="bg-warning/20 text-warning-foreground" />
        <MetricCard label="Sem Estoque" value="2" hint="SKUs" icon={<XCircle className="size-4" />} iconColor="bg-danger/15 text-danger" />
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2">Produto</th><th className="py-2">SKU / EAN</th><th className="py-2">Categoria</th>
                <th className="py-2 text-center" colSpan={3}>Mercado Livre</th>
                <th className="py-2 text-center" colSpan={3}>Magalu</th>
                <th className="py-2">Score SEO</th><th className="py-2">Score Cadastro</th><th className="py-2">Status</th>
              </tr>
              <tr className="text-left text-[11px] text-muted-foreground border-b border-border">
                <th></th><th></th><th></th>
                <th className="py-1">Preço</th><th className="py-1">Estoque</th><th className="py-1">Vendas (30d)</th>
                <th className="py-1">Preço</th><th className="py-1">Estoque</th><th className="py-1">Vendas (30d)</th>
                <th></th><th></th><th></th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.s} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="py-3 font-medium">{p.p}</td>
                  <td className="py-3 text-muted-foreground">{p.s}</td>
                  <td className="py-3 text-muted-foreground">{p.c}</td>
                  <td className="py-3">{p.mlP}</td><td className="py-3">{p.mlE}</td><td className="py-3 font-medium">{p.mlV}</td>
                  <td className="py-3">{p.mgP}</td><td className="py-3">{p.mgE}</td><td className="py-3 font-medium">{p.mgV}</td>
                  <td className="py-3"><span className={`inline-flex items-center justify-center w-9 h-6 rounded text-[11px] font-bold ${scoreColor(p.seo)}`}>{p.seo}</span></td>
                  <td className="py-3"><span className={`inline-flex items-center justify-center w-9 h-6 rounded text-[11px] font-bold ${scoreColor(p.cad)}`}>{p.cad}</span></td>
                  <td className="py-3"><Badge variant="success">{p.st}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Mostrando 1 a 10 de 46 produtos</span>
          <div className="flex gap-1">
            {["‹", "1", "2", "3", "4", "5", "›"].map((p, i) => (
              <button key={i} className={`size-7 rounded ${p === "1" ? "bg-brand-navy text-white" : "border border-border"}`}>{p}</button>
            ))}
            <select className="ml-2 rounded border border-border bg-card px-2 text-xs"><option>10 por página</option></select>
          </div>
        </div>
      </Panel>
    </>
  );
}
