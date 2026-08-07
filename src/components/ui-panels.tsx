import type { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export function MetricCard({
  label,
  value,
  delta,
  trend = "up",
  hint,
  icon,
  iconColor = "bg-info/15 text-info",
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  hint?: string;
  icon?: ReactNode;
  iconColor?: string;
}) {
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-muted-foreground";
  const TrendIcon = trend === "down" ? ArrowDown : ArrowUp;

  return (
    <div className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-2 shadow-[0_6px_24px_-12px_color-mix(in_oklab,var(--brand-navy)_35%,transparent)]">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {icon ? (
          <div className={`size-9 rounded-xl flex items-center justify-center ${iconColor}`}>{icon}</div>
        ) : null}
      </div>
      <div className="text-2xl font-extrabold tracking-tight text-foreground">{value}</div>
      {delta ? (
        <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendIcon className="size-3.5" />
          {delta}
          {hint ? <span className="text-muted-foreground font-normal ml-1">{hint}</span> : null}
        </div>
      ) : hint ? (
        <div className="text-xs text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  );
}


export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-card border border-border shadow-[0_6px_24px_-12px_color-mix(in_oklab,var(--brand-navy)_35%,transparent)] ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {title ? (
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-brand-orange" />
              {title}
            </h3>
          ) : <span />}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}


export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
}) {
  const styles: Record<string, string> = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    danger: "bg-danger/15 text-danger",
    info: "bg-info/15 text-info",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );

}
