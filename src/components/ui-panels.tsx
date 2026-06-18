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
    <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon ? (
          <div className={`size-9 rounded-lg flex items-center justify-center ${iconColor}`}>{icon}</div>
        ) : null}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
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
    <div className={`rounded-xl bg-card border border-border shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : <span />}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
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
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}
