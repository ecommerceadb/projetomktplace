import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildSystemPrompt } from "@/lib/operational-context";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type ChatRequestBody = { messages?: unknown; threadId?: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const { messages, threadId } = body;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        if (!threadId) {
          return new Response("threadId is required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        // Verify caller and get user-scoped supabase client
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return new Response("Unauthorized", { status: 401 });
        }
        const token = authHeader.replace("Bearer ", "");
        const supabase = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
          },
        );
        const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
        if (claimsErr || !claimsData?.claims?.sub) {
          return new Response("Unauthorized", { status: 401 });
        }
        const userId = claimsData.claims.sub as string;

        // Persist the latest user message
        const uiMessages = messages as UIMessage[];
        const lastUserMessage = [...uiMessages].reverse().find((m) => m.role === "user");
        if (lastUserMessage) {
          const { error: insertErr } = await supabase.from("chat_messages").insert({
            thread_id: threadId,
            user_id: userId,
            role: "user",
            parts: lastUserMessage.parts as unknown as Database["public"]["Tables"]["chat_messages"]["Insert"]["parts"],
          });
          if (insertErr) console.error("[chat] save user message", insertErr);

          // Update thread title if still default
          const firstUserText = lastUserMessage.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join(" ")
            .trim();
          if (firstUserText) {
            await supabase
              .from("chat_threads")
              .update({ title: firstUserText.slice(0, 60) })
              .eq("id", threadId)
              .eq("title", "Nova conversa");
          }
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: buildSystemPrompt(),
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: uiMessages,
          onFinish: async ({ messages: finalMessages }) => {
            const assistant = [...finalMessages].reverse().find((m) => m.role === "assistant");
            if (!assistant) return;
            const { error } = await supabase.from("chat_messages").insert({
              thread_id: threadId,
              user_id: userId,
              role: "assistant",
              parts: assistant.parts as unknown as Database["public"]["Tables"]["chat_messages"]["Insert"]["parts"],
            });
            if (error) console.error("[chat] save assistant message", error);
          },
          onError: (error) => {
            console.error("[chat] stream error", error);
            return error instanceof Error ? error.message : "Erro no streaming.";
          },
        });
      },
    },
  },
});
