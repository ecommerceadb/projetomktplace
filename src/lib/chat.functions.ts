import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .select("id, title, updated_at, created_at")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const createThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("chat_threads")
      .insert({ user_id: context.userId, title: "Nova conversa" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { threadId: string }) => d)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .delete()
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const renameThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { threadId: string; title: string }) => d)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("chat_threads")
      .update({ title: data.title })
      .eq("id", data.threadId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type StoredMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: string; text?: string }>;
};

export const loadThreadMessages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { threadId: string }) => d)
  .handler(async ({ data, context }): Promise<StoredMessage[]> => {
    const { data: rows, error } = await context.supabase
      .from("chat_messages")
      .select("id, role, parts, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return JSON.parse(JSON.stringify(rows ?? [])) as StoredMessage[];
  });
