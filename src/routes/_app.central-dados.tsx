import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge } from "@/components/ui-panels";
import { Upload, CheckCircle2, AlertTriangle, AlertCircle, Clock, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/_app/central-dados")({
  head: () => ({ meta: [{ title: "Central de Dados — Operações ADB" }] }),
  component: CentralDados,
});

const importacoes = [
  { a: "Estoque_ML_23052025.xlsx", m: "Mercado Livre", t: "Relatório de Estoque", d: "23/05/2025 09:15", r: "4.568", s: "Processado" },
  { a: "Vendas_ML_23052025.xlsx", m: "Mercado Livre", t: "Relatório de Vendas", d: "23/05/2025 08:50", r: "12.350", s: "Processado" },
  { a: "Pedidos_ML_23052025.xlsx", m: "Mercado Livre", t: "Relatório de Pedidos", d: "23/05/2025 08:45", r: "2.854", s: "Processado" },
  { a: "Estoque_Magalu_23052025.xlsx", m: "Magalu", t: "Relatório de Estoque", d: "23/05/2025 08:20", r: "1.245", s: "Processado" },
  { a: "Vendas_Magalu_23052025.xlsx", m: "Magalu", t: "Relatório de Vendas", d: "23/05/2025 07:50", r: "4.125", s: "Processado" },
];

function CentralDados() {
  return (
    <>
      <TopBar title="Central de Dados" subtitle="Importe e gerencie os dados dos seus marketplaces" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <div className="rounded-xl border-2 border-dashed border-border p-10 text-center bg-muted/30">
            <div className="size-14 mx-auto rounded-full bg-info/15 flex items-center justify-center mb-3">
              <Upload className="size-6 text-info" />
            </div>
            <p className="font-semibold text-foreground">Arraste e solte seus arquivos aqui</p>
            <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-4">Formatos suportados: XLSX, XLS, CSV</p>
            <button className="mt-5 rounded-md bg-brand-navy text-white px-5 py-2 text-sm font-semibold hover:opacity-90">
              Selecionar Arquivo
            </button>
          </div>
        </Panel>
        <Panel title="Validação Automática">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />Colunas válidas</span><span className="font-bold">24</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />Dados processados</span><span className="font-bold">18.542</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertCircle className="size-4 text-danger" />Erros encontrados</span><span className="font-bold text-danger">3</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertTriangle className="size-4 text-warning" />Avisos encontrados</span><span className="font-bold text-warning-foreground">7</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock className="size-4 text-info" />Em processamento</span><span className="font-bold">0</span></li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
            Os dados são utilizados automaticamente pelos agentes IA após o processamento.
          </p>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Últimas Importações" action={<button className="text-xs text-info font-semibold">Ver histórico completo →</button>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="py-2 font-medium">Arquivo</th>
                  <th className="py-2 font-medium">Marketplace</th>
                  <th className="py-2 font-medium">Tipo de Relatório</th>
                  <th className="py-2 font-medium">Data/Hora</th>
                  <th className="py-2 font-medium">Registros</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {importacoes.map((i) => (
                  <tr key={i.a} className="border-b border-border last:border-0">
                    <td className="py-3 flex items-center gap-2 font-medium"><FileSpreadsheet className="size-4 text-muted-foreground" />{i.a}</td>
                    <td className="py-3">{i.m}</td>
                    <td className="py-3 text-muted-foreground">{i.t}</td>
                    <td className="py-3 text-muted-foreground">{i.d}</td>
                    <td className="py-3 font-medium">{i.r}</td>
                    <td className="py-3"><Badge variant="success">{i.s}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
