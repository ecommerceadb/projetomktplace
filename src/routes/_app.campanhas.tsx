import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/_app/campanhas")({
  head: () => ({ meta: [{ title: "Campanhas — Operações ADB" }] }),
  component: () => <StubPage title="Campanhas" subtitle="Acompanhe campanhas patrocinadas, ROAS e investimentos" />,
});
