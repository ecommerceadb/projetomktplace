import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { loadThreadMessages, type StoredMessage } from "@/lib/chat.functions";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  component: ChatThread,
});

const SUGGESTIONS = [
  "Por que as vendas caíram esta semana?",
  "Quais SKUs preciso repor com urgência?",
  "Resuma as oportunidades de SEO mais relevantes.",
  "O que fazer com os anúncios pausados na Mercado Livre?",
];

function ChatThread() {
  const { threadId } = Route.useParams();
  const loadFn = useServerFn(loadThreadMessages);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setToken(data.session?.access_token ?? null));
  }, []);

  const initialQuery = useQuery({
    queryKey: ["chat_messages", threadId],
    queryFn: async () => {
      const rows = (await loadFn({ data: { threadId } })) as StoredMessage[];
      return rows.map<UIMessage>((r) => ({ id: r.id, role: r.role, parts: r.parts as UIMessage["parts"] }));
    },
  });

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: { threadId },
      }),
    [token, threadId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initialQuery.data ?? [],
    transport,
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  const disabled = status === "submitted" || status === "streaming" || !token;

  function handleSubmit(_msg: unknown, event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim() || disabled) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }

  function handleSuggestion(text: string) {
    if (disabled) return;
    sendMessage({ text });
  }

  if (initialQuery.isLoading) {
    return <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Carregando conversa...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-brand-navy text-brand-yellow flex items-center justify-center">
            <Bot className="size-4" />
          </div>
          <div>
            <h1 className="font-semibold">Gerente de Operações IA</h1>
            <p className="text-xs text-muted-foreground">Conectado ao snapshot do dashboard · 23/05/2025</p>
          </div>
        </div>
      </header>

      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="size-12 rounded-full bg-brand-yellow/20 text-brand-orange flex items-center justify-center mx-auto mb-3">
                <Sparkles className="size-5" />
              </div>
              <h2 className="font-bold">Como posso ajudar hoje?</h2>
              <p className="text-sm text-muted-foreground mt-1">Peça análises sobre vendas, estoque, concorrência, SEO ou campanhas.</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    disabled={disabled}
                    className="text-left rounded-lg border border-border bg-card px-3 py-2.5 text-sm hover:bg-accent hover:border-brand-yellow disabled:opacity-60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <div key={i} className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-headings:mt-2 prose-headings:mb-1">
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </div>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Analisando dados do dashboard...</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              Erro: {error.message}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo ao Gerente IA..."
              disabled={disabled}
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={disabled || !input.trim()} />
            </PromptInputFooter>
          </PromptInput>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            Respostas baseadas em snapshot de demonstração — não tomar decisões reais sem validar.
          </p>
        </div>
      </div>
    </div>
  );
}
