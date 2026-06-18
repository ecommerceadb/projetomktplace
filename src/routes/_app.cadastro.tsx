import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/_app/cadastro")({
  head: () => ({ meta: [{ title: "Cadastro — Operações ADB" }] }),
  component: () => <StubPage title="Cadastro" subtitle="Gestão de cadastro de produtos e variantes nos marketplaces" />,
});
