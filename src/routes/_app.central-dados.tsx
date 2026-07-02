import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge } from "@/components/ui-panels";
import { Upload, CheckCircle2, AlertTriangle, AlertCircle, Clock, FileSpreadsheet, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/central-dados")({
  head: () => ({ meta: [{ title: "Central de Dados — Operações ADB" }] }),
  component: CentralDados,
});

type ImportRow = {
  a: string;
  m: string;
  t: string;
  d: string;
  r: string;
  s: "Processado" | "Processando" | "Erro";
};

const importacoesIniciais: ImportRow[] = [
  { a: "Estoque_ML_23052025.xlsx", m: "Mercado Livre", t: "Relatório de Estoque", d: "23/05/2025 09:15", r: "4.568", s: "Processado" },
  { a: "Vendas_ML_23052025.xlsx", m: "Mercado Livre", t: "Relatório de Vendas", d: "23/05/2025 08:50", r: "12.350", s: "Processado" },
  { a: "Pedidos_ML_23052025.xlsx", m: "Mercado Livre", t: "Relatório de Pedidos", d: "23/05/2025 08:45", r: "2.854", s: "Processado" },
  { a: "Estoque_Magazine_23052025.xlsx", m: "Magazine Luiza", t: "Relatório de Estoque", d: "23/05/2025 08:20", r: "1.245", s: "Processado" },
  { a: "Vendas_Magazine_23052025.xlsx", m: "Magazine Luiza", t: "Relatório de Vendas", d: "23/05/2025 07:50", r: "4.125", s: "Processado" },
];

const ACCEPT = ".xlsx,.xls,.csv";
const MAX_MB = 20;

function inferMarketplace(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("magalu") || n.includes("magazine") || n.includes("ml_luiza")) return "Magazine Luiza";
  if (n.includes("ml") || n.includes("mercado") || n.includes("meli")) return "Mercado Livre";
  return "Não identificado";
}

function inferTipo(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("estoque")) return "Relatório de Estoque";
  if (n.includes("venda")) return "Relatório de Vendas";
  if (n.includes("pedido")) return "Relatório de Pedidos";
  if (n.includes("campanha") || n.includes("ads")) return "Relatório de Campanhas";
  return "Relatório Geral";
}

function agora() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function CentralDados() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>(importacoesIniciais);
  const [pending, setPending] = useState<{ name: string; progress: number }[]>([]);

  const handleFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;

    const validos: File[] = [];
    for (const f of arr) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!["xlsx", "xls", "csv"].includes(ext)) {
        toast.error(`${f.name}: formato não suportado`);
        continue;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        toast.error(`${f.name}: excede ${MAX_MB}MB`);
        continue;
      }
      validos.push(f);
    }
    if (validos.length === 0) return;

    setPending((p) => [...p, ...validos.map((f) => ({ name: f.name, progress: 0 }))]);
    toast.success(`${validos.length} arquivo(s) enviado(s) para processamento`);

    validos.forEach((f) => {
      const total = 100;
      const step = () => {
        setPending((prev) => {
          const next = prev.map((it) =>
            it.name === f.name ? { ...it, progress: Math.min(total, it.progress + 20) } : it,
          );
          const done = next.find((it) => it.name === f.name)?.progress === total;
          if (done) {
            const registros = Math.floor(500 + Math.random() * 8000);
            setRows((r) => [
              {
                a: f.name,
                m: inferMarketplace(f.name),
                t: inferTipo(f.name),
                d: agora(),
                r: registros.toLocaleString("pt-BR"),
                s: "Processado",
              },
              ...r,
            ]);
            toast.success(`${f.name}: processado com sucesso`);
            return next.filter((it) => it.name !== f.name);
          }
          return next;
        });
      };
      const iv = setInterval(() => {
        step();
      }, 400);
      setTimeout(() => clearInterval(iv), 400 * 6);
    });
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <>
      <TopBar title="Central de Dados" subtitle="Importe e gerencie os dados dos seus marketplaces" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
              dragOver ? "border-info bg-info/10" : "border-border bg-muted/30 hover:bg-muted/50"
            }`}
          >
            <div className="size-14 mx-auto rounded-full bg-info/15 flex items-center justify-center mb-3">
              <Upload className="size-6 text-info" />
            </div>
            <p className="font-semibold text-foreground">Arraste e solte seus arquivos aqui</p>
            <p className="text-sm text-muted-foreground mt-1">ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-4">Formatos suportados: XLSX, XLS, CSV · até {MAX_MB}MB</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="mt-5 rounded-md bg-brand-navy text-white px-5 py-2 text-sm font-semibold hover:opacity-90"
            >
              Selecionar Arquivo
            </button>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={onInput}
            />
          </div>

          {pending.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Enviando</p>
              {pending.map((p) => (
                <div key={p.name} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium truncate">
                      <FileSpreadsheet className="size-4 text-info" />
                      <span className="truncate">{p.name}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{p.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-info transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Validação Automática">
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />Colunas válidas</span><span className="font-bold">24</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" />Dados processados</span><span className="font-bold">18.542</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertCircle className="size-4 text-danger" />Erros encontrados</span><span className="font-bold text-danger">3</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><AlertTriangle className="size-4 text-warning" />Avisos encontrados</span><span className="font-bold text-warning-foreground">7</span></li>
            <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock className="size-4 text-info" />Em processamento</span><span className="font-bold">{pending.length}</span></li>
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
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((i, idx) => (
                  <tr key={`${i.a}-${idx}`} className="border-b border-border last:border-0">
                    <td className="py-3 flex items-center gap-2 font-medium"><FileSpreadsheet className="size-4 text-muted-foreground" />{i.a}</td>
                    <td className="py-3">{i.m}</td>
                    <td className="py-3 text-muted-foreground">{i.t}</td>
                    <td className="py-3 text-muted-foreground">{i.d}</td>
                    <td className="py-3 font-medium">{i.r}</td>
                    <td className="py-3"><Badge variant="success">{i.s}</Badge></td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setRows((r) => r.filter((_, k) => k !== idx))}
                        className="text-muted-foreground hover:text-danger"
                        aria-label="Remover"
                      >
                        <X className="size-4" />
                      </button>
                    </td>
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
