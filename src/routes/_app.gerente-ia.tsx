import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel } from "@/components/ui-panels";
import { Bot, Send, Sparkles, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/gerente-ia")({
  head: () => ({ meta: [{ title: "Gerente de Operações IA — Operações ADB" }] }),
  component: GerenteIA,
});

type Msg = { from: "ai" | "user"; text: string; list?: string[]; actions?: string[]; impact?: string };

const initialMsgs: Msg[] = [
  { from: "ai", text: "Olá, Gestor! Sou o Gerente de Operações IA. Como posso ajudar hoje?" },
  { from: "user", text: "Por que as vendas caíram esta semana?" },
  {
    from: "ai",
    text: "Identifiquei três fatores principais para a queda de vendas nesta semana:",
    list: [
      "Queda de estoque em 12 SKUs, principalmente Castanha de Caju 100g.",
      "Concorrentes reduziram preços em média 8,5% na categoria Castanhas.",
      "Conversão na Magalu caiu de 2,3% para 1,9%.",
    ],
    impact: "R$ 18.450 em vendas perdidas",
    actions: [
      "Repor estoque dos SKUs críticos (CAJ100, MIX100).",
      "Ajustar preços em 7% nos produtos mais sensíveis.",
      "Melhorar conteúdo de 8 anúncios com baixo score SEO.",
    ],
  },
];

function GerenteIA() {
  const [msgs, setMsgs] = useState(initialMsgs);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    setMsgs((m) => [
      ...m,
      { from: "user", text: input },
      { from: "ai", text: "Analisando os dados mais recentes... essa é uma demonstração — em produção, eu cruzaria dados de vendas, estoque e concorrência para te responder em tempo real." },
    ]);
    setInput("");
  }

  return (
    <>
      <TopBar title="Gerente de Operações IA" subtitle="Converse com a IA e receba insights inteligentes sobre sua operação" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="lg:col-span-2">
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
            {msgs.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${m.from === "ai" ? "bg-brand-navy text-brand-yellow" : "bg-muted text-foreground"}`}>
                  {m.from === "ai" ? <Bot className="size-4" /> : "U"}
                </div>
                <div className={`rounded-xl px-4 py-3 max-w-[85%] text-sm ${m.from === "ai" ? "bg-muted text-foreground" : "bg-brand-yellow/30 text-foreground"}`}>
                  <p>{m.text}</p>
                  {m.list && (
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      {m.list.map((l) => <li key={l}>{l}</li>)}
                    </ol>
                  )}
                  {m.impact && <p className="mt-3"><strong>Impacto estimado:</strong> {m.impact}</p>}
                  {m.actions && (
                    <>
                      <p className="mt-3 font-semibold">Ações recomendadas:</p>
                      <ul className="mt-1 space-y-1">
                        {m.actions.map((a) => (
                          <li key={a} className="flex items-start gap-2"><CheckCircle2 className="size-3.5 text-success mt-0.5 shrink-0" />{a}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Pergunte algo ou digite um comando..."
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={send} className="size-10 rounded-md bg-brand-navy text-white flex items-center justify-center hover:opacity-90">
              <Send className="size-4" />
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Resumo por Marketplace">
            <div className="space-y-4">
              <div className="rounded-lg bg-brand-yellow/15 p-3">
                <div className="text-xs font-semibold text-foreground">Mercado Livre</div>
                <div className="text-xs text-muted-foreground mt-2">Faturamento</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">R$ 185.420</span>
                  <span className="text-xs font-semibold text-success flex items-center"><ArrowUp className="size-3" />18,7%</span>
                </div>
                <div className="mt-3 text-xs font-semibold text-foreground">Principais Alertas</div>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  <li>⚠ 3 rupturas de estoque</li>
                  <li>⚠ 5 oportunidades SEO</li>
                  <li>⚠ 2 anúncios perdendo competitividade</li>
                </ul>
              </div>
              <div className="rounded-lg bg-info/10 p-3">
                <div className="text-xs font-semibold text-foreground">Magalu</div>
                <div className="text-xs text-muted-foreground mt-2">Faturamento</div>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold">R$ 72.580</span>
                  <span className="text-xs font-semibold text-danger flex items-center"><ArrowDown className="size-3" />4,2%</span>
                </div>
                <div className="mt-3 text-xs font-semibold text-foreground">Principais Alertas</div>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  <li>⚠ Conversão caiu 8%</li>
                  <li>⚠ 4 SKUs com estoque crítico</li>
                  <li>⚠ Preço acima da média em 6 produtos</li>
                </ul>
              </div>
            </div>
          </Panel>
          <button className="w-full rounded-md bg-brand-yellow text-brand-navy font-semibold py-2.5 text-sm flex items-center justify-center gap-2">
            <Sparkles className="size-4" /> Gerar Plano Diário com IA
          </button>
        </div>
      </div>
    </>
  );
}
