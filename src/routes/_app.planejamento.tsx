import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Panel } from "@/components/ui-panels";
import { Sparkles, Lightbulb, Megaphone, DollarSign, X, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/planejamento")({
  head: () => ({ meta: [{ title: "Planejamento Comercial — Operações ADB" }] }),
  component: Planejamento,
});

type Tone = "success" | "warning" | "info";
type EventCell = { month: string; label: string; tone: Tone };
type CalendarRow = { id: string; d: string; date: string; events: EventCell[] };

const MESES = ["Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro"];

const INITIAL: CalendarRow[] = [
  { id: "maes", d: "Dia das Mães", date: "11/05", events: [
    { month: "Maio", label: "Campanha ativa 01/05 – 12/05", tone: "success" },
    { month: "Junho", label: "Reforçar estoque de Kits e Canecas. Aumentar investimento em 20%", tone: "info" },
  ]},
  { id: "consumidor", d: "Semana do Consumidor", date: "05/03 – 22/03", events: [
    { month: "Maio", label: "Planejamento 01/03 – 14/03", tone: "warning" },
    { month: "Junho", label: "Campanha ativa 15/03 – 22/03", tone: "success" },
    { month: "Julho", label: "Foco em Frete Grátis e Ofertas Relâmpago", tone: "info" },
  ]},
  { id: "namorados", d: "Dia dos Namorados", date: "12/06", events: [
    { month: "Junho", label: "Planejamento 20/05 – 11/06", tone: "warning" },
    { month: "Julho", label: "Kits Presente e Canecas. Ações românticas", tone: "info" },
  ]},
  { id: "bf", d: "Black Friday", date: "28/11", events: [
    { month: "Setembro", label: "Planejamento 01/11 – 27/11", tone: "warning" },
    { month: "Outubro", label: "Aumentar estoque em 40%. Campanhas antecipadas", tone: "info" },
  ]},
  { id: "natal", d: "Natal", date: "25/12", events: [
    { month: "Outubro", label: "Planejamento 01/11 – 24/12", tone: "warning" },
    { month: "Outubro", label: "Kits de presentes e Combos. Comunicação emocional", tone: "info" },
  ]},
  { id: "anonovo", d: "Ano Novo", date: "01/01/2026", events: [
    { month: "Outubro", label: "Planejamento 15/12 – 31/12", tone: "warning" },
    { month: "Outubro", label: "Kits saudáveis e mensagens motivacionais", tone: "info" },
  ]},
];

const recomendacoes = [
  { i: Lightbulb, t: "Estoque", d: "Inicie o aumento de estoque de Castanha de Caju 100g até 20/10 para Black Friday." },
  { i: Megaphone, t: "Campanhas", d: "Kits Presente Castanhas tem potencial de crescimento de 35% no Natal." },
  { i: DollarSign, t: "Precificação", d: "Revise preços em Setembro para ganhar competitividade na Black Friday." },
];

const toneClass = (t: Tone) =>
  t === "success" ? "bg-success/15 text-success"
  : t === "warning" ? "bg-warning/20 text-warning-foreground"
  : "bg-info/10 text-info";

function Planejamento() {
  const [view, setView] = useState<"calendario" | "lista">("calendario");
  const [rows, setRows] = useState<CalendarRow[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ d: "", date: "", month: MESES[0], label: "", tone: "info" as Tone });

  const resetForm = () => setForm({ d: "", date: "", month: MESES[0], label: "", tone: "info" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.d.trim() || !form.date.trim() || !form.label.trim()) return;
    setRows((r) => [
      ...r,
      { id: `${Date.now()}`, d: form.d, date: form.date, events: [{ month: form.month, label: form.label, tone: form.tone }] },
    ]);
    resetForm();
    setOpen(false);
  };

  const removeRow = (id: string) => setRows((r) => r.filter((x) => x.id !== id));

  return (
    <>
      <TopBar title="Planejamento Comercial" subtitle="Planeje ações, campanhas e estoque para as principais datas do calendário comercial." />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 rounded-md bg-muted p-1 text-xs">
          <button
            onClick={() => setView("calendario")}
            className={`rounded px-3 py-1.5 ${view === "calendario" ? "bg-card font-semibold shadow-sm" : "text-muted-foreground"}`}
          >
            Calendário
          </button>
          <button
            onClick={() => setView("lista")}
            className={`rounded px-3 py-1.5 ${view === "lista" ? "bg-card font-semibold shadow-sm" : "text-muted-foreground"}`}
          >
            Lista
          </button>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-brand-navy text-white px-4 py-2 text-sm font-semibold flex items-center gap-2"
        >
          <Plus className="size-4" /> Adicionar Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          {view === "calendario" ? (
            <div className="overflow-x-auto">
              <div className="min-w-[820px]">
                <div className="grid grid-cols-[200px_repeat(6,1fr)] gap-2 mb-3 text-xs font-semibold text-muted-foreground">
                  <div>Data comercial</div>
                  {MESES.map((m) => <div key={m}>{m}</div>)}
                </div>
                <div className="space-y-3">
                  {rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-[200px_repeat(6,1fr)] gap-2 items-start border-t border-border pt-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-sm">{row.d}</div>
                          <div className="text-xs text-muted-foreground">{row.date}</div>
                        </div>
                        <button onClick={() => removeRow(row.id)} className="text-muted-foreground hover:text-destructive" title="Remover">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      {MESES.map((m) => {
                        const ev = row.events.find((e) => e.month === m);
                        return (
                          <div key={m}>
                            {ev ? (
                              <div className={`rounded-md px-2 py-1.5 text-[11px] ${toneClass(ev.tone)}`}>{ev.label}</div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {rows.length === 0 && <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>}
              {rows.map((row) => (
                <div key={row.id} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm">{row.d}</div>
                      <div className="text-xs text-muted-foreground">{row.date}</div>
                    </div>
                    <button onClick={() => removeRow(row.id)} className="text-muted-foreground hover:text-destructive" title="Remover">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {row.events.map((e, i) => (
                      <li key={i} className={`rounded-md px-2 py-1.5 text-xs ${toneClass(e.tone)}`}>
                        <span className="font-semibold mr-2">{e.month}:</span>{e.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-brand-orange" />
            Planejamento bem executado pode aumentar seu faturamento em até <strong className="text-foreground">28%</strong> nas principais datas.
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Recomendações da IA">
            <ul className="space-y-4">
              {recomendacoes.map((r) => {
                const I = r.i;
                return (
                  <li key={r.t} className="flex gap-3">
                    <div className="size-9 rounded-lg bg-brand-yellow/20 text-brand-orange flex items-center justify-center shrink-0"><I className="size-4" /></div>
                    <div>
                      <div className="font-semibold text-sm">{r.t}</div>
                      <p className="text-xs text-muted-foreground">{r.d}</p>
                      <button className="text-xs text-info font-semibold mt-1">Ver detalhes</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
          <button className="w-full rounded-md bg-brand-yellow text-brand-navy py-2.5 text-sm font-semibold flex items-center justify-center gap-2"><Sparkles className="size-4" /> Gerar plano com IA</button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-card p-5 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Novo Evento</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <label className="block text-xs font-medium">
              Nome do evento
              <input
                required
                value={form.d}
                onChange={(e) => setForm({ ...form, d: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex.: Dia do Cliente"
              />
            </label>

            <label className="block text-xs font-medium">
              Data
              <input
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex.: 15/09"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium">
                Mês
                <select
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {MESES.map((m) => <option key={m}>{m}</option>)}
                </select>
              </label>
              <label className="block text-xs font-medium">
                Status
                <select
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value as Tone })}
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="info">Planejamento</option>
                  <option value="warning">Em preparação</option>
                  <option value="success">Ativa</option>
                </select>
              </label>
            </div>

            <label className="block text-xs font-medium">
              Descrição / ação
              <textarea
                required
                rows={3}
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Ex.: Campanha ativa 10/09 – 20/09"
              />
            </label>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-border px-3 py-2 text-sm">
                Cancelar
              </button>
              <button type="submit" className="rounded-md bg-brand-navy text-white px-4 py-2 text-sm font-semibold">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
