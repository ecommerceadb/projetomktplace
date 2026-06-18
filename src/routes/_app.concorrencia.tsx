import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/_app/concorrencia")({
  head: () => ({ meta: [{ title: "Concorrência — Operações ADB" }] }),
  component: () => <StubPage title="Concorrência" subtitle="Monitore preços e movimentos dos seus concorrentes" />,
});
