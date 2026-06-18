import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel, Badge } from "@/components/ui-panels";
import { useState } from "react";

export const Route = createFileRoute("/_app/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — Operações ADB" }] }),
  component: Configuracoes,
});

function Configuracoes() {
  const [tab, setTab] = useState("Geral");
  const tabs = ["Geral", "Usuários", "Notificações", "IA e Alertas", "Integrações"];

  return (
    <>
      <TopBar title="Configurações" subtitle="Gerencie preferências, integrações e usuários da plataforma" />
      <div className="flex gap-1 rounded-md bg-muted p-1 text-xs w-fit mb-6">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded px-4 py-1.5 font-medium ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

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
    </>
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
