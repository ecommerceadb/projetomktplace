import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/_app/performance")({
  head: () => ({ meta: [{ title: "Performance — Operações ADB" }] }),
  component: () => <StubPage title="Performance" subtitle="Indicadores de performance por marketplace e categoria" />,
});
