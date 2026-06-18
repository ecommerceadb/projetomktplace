import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/TopBar";
import { Panel } from "@/components/ui-panels";
import { Construction } from "lucide-react";

function makeStub(path: string, title: string, subtitle: string) {
  return createFileRoute(path as never)({
    head: () => ({ meta: [{ title: `${title} — Operações ADB` }] }),
    component: () => (
      <>
        <TopBar title={title} subtitle={subtitle} />
        <Panel>
          <div className="py-16 text-center">
            <div className="size-14 rounded-full bg-brand-yellow/20 text-brand-orange flex items-center justify-center mx-auto"><Construction className="size-6" /></div>
            <h2 className="mt-4 font-semibold text-lg">Módulo em construção</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              Este módulo faz parte do protótipo interativo. Os dados e fluxos completos estarão disponíveis em breve.
            </p>
          </div>
        </Panel>
      </>
    ),
  });
}

export { makeStub };
