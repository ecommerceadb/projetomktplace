import type { ReactNode } from "react";
import { Bell, HelpCircle, Calendar } from "lucide-react";

function formatToday() {
  const d = new Date();
  const s = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  // "23 de maio de 2025" -> capitalize month
  return s.replace(/ de (\p{L})/u, (_, c) => ` de ${c.toUpperCase()}`);
}

export function TopBar({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        {right}
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
          <Calendar className="size-4" />
          {formatToday()}
        </button>
        <button className="relative size-9 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-accent">
          <Bell className="size-4" />
          <span className="absolute -top-1 -right-1 size-4 rounded-full bg-danger text-[10px] font-bold text-danger-foreground flex items-center justify-center">1</span>
        </button>
        <button className="size-9 inline-flex items-center justify-center rounded-md border border-border bg-card hover:bg-accent">
          <HelpCircle className="size-4" />
        </button>
      </div>
    </div>
  );
}
