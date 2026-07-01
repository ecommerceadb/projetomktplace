"use client";

import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, LayoutDashboard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { nav } from "@/components/AppSidebar";
import logoAsset from "@/assets/amigos-do-bem-logo.webp.asset.json";

const marketplaceLinks = [
  {
    to: "/mercado-livre",
    label: "Mercado Livre",
    className: "bg-brand-yellow text-sidebar",
  },
  {
    to: "/magazine-luiza",
    label: "Magazine Luiza",
    className: "bg-white/95 text-sidebar",
  },
  {
    to: "/",
    label: "Visão Consolidada",
    className: "border border-white/15 text-sidebar-foreground/90",
  },
];

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-white/10">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center size-10 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] bg-sidebar text-sidebar-foreground p-0 border-r border-white/10"
        >
          <div className="sr-only">
            <SheetTitle>Menu de navegação</SheetTitle>
            <SheetDescription>
              Navegue entre as seções do painel de operações
            </SheetDescription>
          </div>

          <div className="flex flex-col h-full">
            <div className="px-5 pt-6 pb-4 flex flex-col items-center text-center border-b border-white/10">
              <div className="size-20 rounded-full bg-white flex items-center justify-center shadow-lg ring-4 ring-sidebar overflow-hidden">
                <img
                  src={logoAsset.url}
                  alt="Amigos do Bem"
                  className="size-full object-contain"
                />
              </div>
              <div className="mt-3">
                <div className="text-[11px] tracking-[0.22em] font-semibold text-brand-yellow">
                  MARKETPLACE
                </div>
                <div className="text-[11px] tracking-[0.22em] font-semibold text-sidebar-foreground/80">
                  OPERAÇÕES ADB
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {nav.map((item) => {
                const active = pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
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
                {marketplaceLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold hover:brightness-105 transition-colors ${link.className}`}
                  >
                    {link.to === "/" && (
                      <LayoutDashboard className="size-3.5" />
                    )}
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="border-t border-white/10 px-4 py-3 flex items-center gap-3">
              <div className="size-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  Administrador
                </div>
                <div className="text-[11px] text-sidebar-foreground/70 truncate">
                  admin@adb.com
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img
            src={logoAsset.url}
            alt="Amigos do Bem"
            className="size-full object-contain"
          />
        </div>
        <div className="text-xs font-semibold leading-tight">
          <div className="text-brand-yellow">MARKETPLACE</div>
          <div className="text-sidebar-foreground/80">OPERAÇÕES ADB</div>
        </div>
      </div>

      <div className="size-10" aria-hidden="true" />
    </header>
  );
}
