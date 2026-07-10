import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge } from "@/components/ui-panels";
import { useEffect, useState } from "react";
import { AI_PROVIDERS, loadAiConfig, saveAiConfig, type AiProviderId } from "@/lib/ai-provider";
import { Sparkles, CheckCircle2, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_app/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Operações ADB" }] }),
  component: Configuracoes,
});

const TABS = ["Geral", "Provedores de IA", "Integrações"] as const;

function Configuracoes() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Geral");

  return (
    <>
      <TopBar title="Configurações" subtitle="Gerencie preferências, integrações e usuários da plataforma" />
      <div className="flex flex-wrap gap-1 rounded-md bg-muted p-1 text-xs w-fit mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded px-4 py-1.5 font-medium ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Provedores de IA" ? <ProvedoresIA /> : <Geral />}
    </>
  );
}

function Geral() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Panel title="Preferências Gerais">
        <div className="space-y-4 text-sm">
          <Field label="Nome da Empresa" value="Amigos do Bem" />
          <Field label="Fuso Horário" value="(UTC-03:00) Brasília" />
          <Field label="Moeda" value="BRL - Real" />
          <Field label="Idioma" value="Português" />
          <Field label="E-mail para alertas" value="contato@amigosdobem.com.br" />
          <button className="w-full rounded-md bg-brand-navy text-white py-2.5 text-sm font-semibold">Salvar Alterações</button>
        </div>
      </Panel>

      <Panel title="Integrações Futuras">
        <ul className="space-y-3">
          {[
            { n: "mercado livre", s: "Conectado", v: "success" as const },
            { n: "magalu", s: "Conectado", v: "success" as const },
            { n: "Shopee", s: "Em breve", v: "muted" as const },
            { n: "amazon", s: "Em breve", v: "muted" as const },
          ].map((i) => (
            <li key={i.n} className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="font-semibold text-sm">{i.n}</span>
              <Badge variant={i.v}>{i.s}</Badge>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Informações da Conta">
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Plano Atual</div>
            <div className="font-semibold">Profissional</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Limite de Usuários</div>
            <div className="font-semibold">10 usuários</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Armazenamento</div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-success" style={{ width: "78%" }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">78% utilizado (7,8 GB / 10 GB)</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Renovação do Plano</div>
            <div className="font-semibold">15/06/2025</div>
          </div>
          <button className="w-full rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-accent">Gerenciar Plano</button>
        </div>
      </Panel>
    </div>
  );
}

function ProvedoresIA() {
  const [provider, setProvider] = useState<AiProviderId>("lovable");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cfg = loadAiConfig();
    setProvider(cfg.provider);
    setApiKey(cfg.apiKey ?? "");
    setModel(cfg.model ?? "");
  }, []);

  const current = AI_PROVIDERS.find((p) => p.id === provider)!;

  function handleSave() {
    saveAiConfig({
      provider,
      apiKey: provider === "lovable" ? undefined : apiKey.trim() || undefined,
      model: model.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Panel title="Escolha o provedor de IA" className="lg:col-span-2">
        <p className="text-xs text-muted-foreground mb-4">
          Todas as operações de IA da plataforma (Chat IA, Relatório Executivo, Oportunidades) usam este provedor.
          Comece com a opção gratuita — quando os créditos acabarem, informe uma chave paga de OpenAI, Anthropic ou Google.
        </p>

        <div className="space-y-2">
          {AI_PROVIDERS.map((p) => (
            <label
              key={p.id}
              className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
                provider === p.id ? "border-brand-yellow bg-brand-yellow/5" : "border-border hover:bg-accent"
              }`}
            >
              <input
                type="radio"
                name="ai-provider"
                checked={provider === p.id}
                onChange={() => setProvider(p.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{p.label}</span>
                  {p.id === "lovable" && (
                    <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded">GRÁTIS</span>
                  )}
                  {p.id !== "lovable" && (
                    <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">PAGO</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{p.description}</div>
              </div>
            </label>
          ))}
        </div>

        {provider !== "lovable" && (
          <div className="mt-5 space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <KeyRound className="size-4 text-brand-navy" /> Chave de API — {current.label}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
              {current.keyHelp && (
                <div className="text-[11px] text-muted-foreground mt-1">{current.keyHelp}</div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Modelo (opcional)</label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder={current.defaultModel}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
              />
              <div className="text-[11px] text-muted-foreground mt-1">
                Deixe em branco para usar <code>{current.defaultModel}</code>.
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              A chave é armazenada apenas neste navegador (localStorage) e enviada só para as chamadas de IA.
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="rounded-md bg-brand-navy text-white px-5 py-2 text-sm font-semibold hover:brightness-110"
          >
            Salvar Configuração
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-success font-semibold">
              <CheckCircle2 className="size-4" /> Configuração salva
            </span>
          )}
        </div>
      </Panel>

      <Panel title="Como funciona">
        <ul className="space-y-3 text-xs">
          <li className="flex items-start gap-2">
            <Sparkles className="size-3.5 text-brand-orange mt-0.5 shrink-0" />
            <span>A opção <strong>Lovable AI</strong> usa os créditos gratuitos incluídos na sua conta.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="size-3.5 text-brand-orange mt-0.5 shrink-0" />
            <span>Se os créditos acabarem (erro <code>402</code>), troque para uma opção paga informando sua chave.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="size-3.5 text-brand-orange mt-0.5 shrink-0" />
            <span>A chave nunca sai do seu navegador — é enviada só quando você faz uma chamada de IA.</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="size-3.5 text-brand-orange mt-0.5 shrink-0" />
            <span>Você pode voltar para o Lovable AI a qualquer momento.</span>
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input defaultValue={value} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
