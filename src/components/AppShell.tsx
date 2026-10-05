import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Trening" },
  { to: "/stats", label: "Statystyki" },
  { to: "/history", label: "Historia" },
  { to: "/profile", label: "Profil" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <nav className="hidden w-52 shrink-0 border-r p-4 md:block">
        <div className="mb-6 font-bold">Dziennik treningowy</div>
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: t.to === "/" }} activeProps={{ className: "bg-muted font-semibold" }} className="block rounded-md px-3 py-2">
            {t.label}
          </Link>
        ))}
      </nav>
      <main className="mx-auto w-full max-w-2xl flex-1 pb-20 md:pb-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-background md:hidden">
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: t.to === "/" }} activeProps={{ className: "font-semibold text-foreground" }} className="py-3 text-center text-xs text-muted-foreground">
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, left, right }: { title: string; left?: ReactNode; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center border-b bg-background px-3 py-3">
      <div className="min-w-0">{left}</div>
      <h1 className="truncate font-semibold">{title}</h1>
      <div className="flex justify-end">{right}</div>
    </header>
  );
}
