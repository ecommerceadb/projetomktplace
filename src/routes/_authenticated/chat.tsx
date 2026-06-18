import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Bot, Plus, MessageSquare, Trash2, LogOut, ArrowLeft, Sparkles } from "lucide-react";
import { listThreads, createThread, deleteThread } from "@/lib/chat.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "Gerente IA — Operações ADB" }] }),
  component: ChatLayout,
});

function ChatLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const params = useParams({ strict: false }) as { threadId?: string };
  const activeThreadId = params.threadId;

  const fetchThreads = useServerFn(listThreads);
  const createFn = useServerFn(createThread);
  const deleteFn = useServerFn(deleteThread);

  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const threadsQuery = useQuery({
    queryKey: ["chat_threads"],
    queryFn: () => fetchThreads(),
  });

  const createMut = useMutation({
    mutationFn: () => createFn(),
    onSuccess: async (thread) => {
      await qc.invalidateQueries({ queryKey: ["chat_threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Falha ao criar conversa"),
  });

  const deleteMut = useMutation({
    mutationFn: (threadId: string) => deleteFn({ data: { threadId } }),
    onSuccess: async (_data, threadId) => {
      await qc.invalidateQueries({ queryKey: ["chat_threads"] });
      if (threadId === activeThreadId) navigate({ to: "/chat" });
    },
  });

  // Auto-create the first thread when none exists and user lands on /chat
  useEffect(() => {
    if (!activeThreadId && threadsQuery.data && threadsQuery.data.length === 0 && !createMut.isPending) {
      createMut.mutate();
    }
    if (!activeThreadId && threadsQuery.data && threadsQuery.data.length > 0) {
      navigate({ to: "/chat/$threadId", params: { threadId: threadsQuery.data[0].id }, replace: true });
    }
  }, [activeThreadId, threadsQuery.data]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Thread sidebar */}
      <aside className="hidden md:flex w-72 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="size-10 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center">
            <Bot className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">Gerente IA</div>
            <div className="text-[11px] text-sidebar-foreground/60 truncate">{email ?? "—"}</div>
          </div>
        </div>

        <div className="p-3">
          <button
            onClick={() => createMut.mutate()}
            disabled={createMut.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-yellow text-brand-navy font-semibold py-2 text-sm hover:brightness-105 disabled:opacity-60"
          >
            <Plus className="size-4" /> Nova conversa
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {threadsQuery.isLoading && <p className="px-3 py-2 text-xs text-sidebar-foreground/60">Carregando...</p>}
          {threadsQuery.data?.length === 0 && !createMut.isPending && (
            <p className="px-3 py-2 text-xs text-sidebar-foreground/60">Sem conversas ainda.</p>
          )}
          {threadsQuery.data?.map((t) => {
            const active = t.id === activeThreadId;
            return (
              <div
                key={t.id}
                className={`group flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
                  active ? "bg-white/10 text-white" : "text-sidebar-foreground/85 hover:bg-white/5"
                }`}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex-1 min-w-0 flex items-center gap-2"
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <span className="truncate">{t.title}</span>
                </Link>
                <button
                  onClick={() => {
                    if (confirm("Excluir esta conversa?")) deleteMut.mutate(t.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-sidebar-foreground/60 hover:text-danger transition-opacity"
                  aria-label="Excluir conversa"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-1">
          <Link to="/" className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-sidebar-foreground/80 hover:bg-white/5">
            <ArrowLeft className="size-3.5" /> Voltar ao dashboard
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 rounded-md px-2 py-2 text-xs text-sidebar-foreground/80 hover:bg-white/5">
            <LogOut className="size-3.5" /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {activeThreadId ? (
          <Outlet />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center px-6">
            <div>
              <div className="size-14 rounded-full bg-brand-yellow/20 text-brand-orange flex items-center justify-center mx-auto mb-4">
                <Sparkles className="size-6" />
              </div>
              <h2 className="font-bold text-lg">Crie sua primeira conversa</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                O Gerente IA analisa as métricas do dashboard e propõe ações concretas para sua operação.
              </p>
              <Button className="mt-4 bg-brand-navy hover:bg-brand-navy/90" onClick={() => createMut.mutate()}>
                <Plus className="size-4" /> Nova conversa
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
