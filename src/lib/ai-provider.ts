// Shared AI provider configuration used across all IA operations.
// The user can escolher "Lovable AI (grátis)" ou informar sua própria API key
// de OpenAI, Anthropic (Claude) ou Google Gemini quando os créditos gratuitos
// acabarem. Configuração fica em localStorage no navegador.

export type AiProviderId = "lovable" | "openai" | "anthropic" | "google";

export type AiProviderConfig = {
  provider: AiProviderId;
  apiKey?: string;
  model?: string;
};

export const AI_PROVIDERS: {
  id: AiProviderId;
  label: string;
  description: string;
  defaultModel: string;
  keyHelp?: string;
}[] = [
  {
    id: "lovable",
    label: "Lovable AI (Gratuito)",
    description: "Usa os créditos gratuitos incluídos. Não requer chave.",
    defaultModel: "google/gemini-3-flash-preview",
  },
  {
    id: "openai",
    label: "OpenAI (chave própria)",
    description: "Use sua API key da OpenAI (plano pago).",
    defaultModel: "gpt-4o-mini",
    keyHelp: "Obtenha em platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    label: "Anthropic Claude (chave própria)",
    description: "Use sua API key da Anthropic (plano pago).",
    defaultModel: "claude-3-5-sonnet-latest",
    keyHelp: "Obtenha em console.anthropic.com",
  },
  {
    id: "google",
    label: "Google Gemini (chave própria)",
    description: "Use sua API key do Google AI Studio (plano pago).",
    defaultModel: "gemini-2.5-flash",
    keyHelp: "Obtenha em aistudio.google.com/apikey",
  },
];

const STORAGE_KEY = "adb.ai-provider.config";

export function loadAiConfig(): AiProviderConfig {
  if (typeof window === "undefined") return { provider: "lovable" };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { provider: "lovable" };
    const parsed = JSON.parse(raw) as AiProviderConfig;
    if (!parsed?.provider) return { provider: "lovable" };
    return parsed;
  } catch {
    return { provider: "lovable" };
  }
}

export function saveAiConfig(config: AiProviderConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}
