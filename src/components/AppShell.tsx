import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, CalendarDays, Dumbbell, User } from "lucide-react";
import type { ReactNode } from "react";

const TABS = [
  { to: "/", label: "Trening", icon: Dumbbell },
  { to: "/stats", label: "Statystyki", icon: BarChart3 },
  { to: "/history", label: "Historia", icon: CalendarDays },
  { to: "/profile", label: "Profil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/login") return <main className="mx-auto min-h-screen w-full max-w-2xl">{children}</main>;
  return (
    <div className="min-h-screen md:flex">
      <nav className="hidden w-60 shrink-0 border-r bg-sidebar/60 p-5 md:block">
        <div className="display mb-8 text-3xl">Lift<span className="text-primary">.</span>Log</div>
        <div className="space-y-1">
          {TABS.map((t) => (
            <Link key={t.to} to={t.to} activeOptions={{ exact: t.to === "/" }}
              activeProps={{ className: "bg-secondary text-primary" }}
              className="flex items-center gap-3 rounded-full px-4 py-2.5 font-medium">
              <t.icon className="h-4 w-4" /> {t.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="mx-auto w-full max-w-2xl flex-1 pb-28 md:pb-10">{children}</main>
      <nav className="fixed inset-x-4 bottom-4 z-40 grid grid-cols-4 rounded-full border bg-sidebar/95 p-1.5 backdrop-blur md:hidden">
        {TABS.map((t) => (
          <Link key={t.to} to={t.to} activeOptions={{ exact: t.to === "/" }} aria-label={t.label}
            activeProps={{ className: "bg-secondary text-primary" }}
            inactiveProps={{ className: "text-muted-foreground" }}
            className="flex flex-col items-center gap-0.5 rounded-full py-2 text-[10px] font-medium">
            <t.icon className="h-5 w-5" />
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, left, right }: { title: string; subtitle?: string | undefined; left?: ReactNode; right?: ReactNode }) {
  return (
    <header className="px-4 pb-2 pt-6">
      {(left || right) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">{left}</div>
          <div className="shrink-0">{right}</div>
        </div>
      )}
      <h1 className="display truncate text-6xl md:text-7xl">{title}</h1>
      {subtitle && <p className="label-mono mt-2">{subtitle}</p>}
    </header>
  );
}
