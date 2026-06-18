import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/_app/seo")({
  head: () => ({ meta: [{ title: "SEO Marketplace — Operações ADB" }] }),
  component: () => <StubPage title="SEO Marketplace" subtitle="Otimização de títulos, descrições e atributos de busca" />,
});
