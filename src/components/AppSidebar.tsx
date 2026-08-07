import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Megaphone,
  FileText,
  AlertTriangle,
  CalendarRange,
  Database,
  Settings,
  ChevronDown,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import logoAsset from "@/assets/amigos-do-bem-logo.webp.asset.json";

type NavItem = { to: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

export const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/estoque", label: "Estoque", icon: Package },
  { to: "/performance", label: "Performance", icon: TrendingUp },
  { to: "/campanhas", label: "Campanhas", icon: Megaphone },
  { to: "/relatorios", label: "Relatórios", icon: FileText },
  { to: "/central-dados", label: "Central de Dados", icon: Database },
  { to: "/central-alertas", label: "Central de Alertas", icon: AlertTriangle },
  { to: "/planejamento", label: "Planejamento Comercial", icon: CalendarRange },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pt-6 pb-4 flex flex-col items-center text-center">
        <div className="size-24 rounded-full bg-white flex items-center justify-center shadow-lg ring-4 ring-sidebar overflow-hidden">
          <img src={logoAsset.url} alt="Amigos do Bem" className="size-full object-contain" />
        </div>
        <div className="mt-3">
          <div className="text-[11px] tracking-[0.22em] font-semibold text-brand-yellow">MARKETPLACE</div>
          <div className="text-[11px] tracking-[0.22em] font-semibold text-sidebar-foreground/80">OPERAÇÕES ADB</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-sidebar-active text-sidebar-active-foreground font-semibold shadow-sm"
                  : "text-sidebar-foreground/85 hover:bg-white/5 hover:text-white"
              }`}

            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-5 mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-brand-yellow">
          MARKETPLACES
        </div>
        <div className="px-2 space-y-2">
          <Link to="/mercado-livre" className="flex items-center justify-between rounded-xl bg-brand-yellow text-sidebar px-3 py-2.5 text-xs font-semibold hover:brightness-105">
            <span>mercado livre</span>
            <span className="opacity-80">Mercado Livre</span>
          </Link>
          <Link to="/magazine-luiza" className="flex items-center justify-between rounded-xl bg-white/95 text-sidebar px-3 py-2.5 text-xs font-semibold hover:brightness-105">
            <span>magazine</span>
            <span className="opacity-80">Magazine Luiza</span>
          </Link>
          <Link to="/" className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-xs font-medium text-sidebar-foreground/90 hover:bg-white/5">
            <LayoutDashboard className="size-3.5" />
            Visão Consolidada
          </Link>
        </div>

      </nav>

      <div className="border-t border-white/10 px-4 py-3 flex items-center gap-3">
        <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">A</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">Administrador</div>
          <div className="text-[11px] text-sidebar-foreground/70 truncate">admin@adb.com</div>
        </div>
        <ChevronDown className="size-4 text-sidebar-foreground/60" />
      </div>
    </aside>
  );
}
