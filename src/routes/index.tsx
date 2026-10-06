import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Play, Plus } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { exerciseById, PLAN_TYPES } from "@/lib/data";
import { currentPlan, startWorkout, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Trening — Dziennik treningowy" },
    { name: "description", content: "Wybierz dzień planu i rozpocznij kolejny trening." },
    { property: "og:title", content: "Trening — Dziennik treningowy" },
    { property: "og:description", content: "Wybierz dzień planu i rozpocznij kolejny trening." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: TrainingTab,
});

function TrainingTab() {
  const planType = useStore((s) => s.planType);
  const plan = useStore(currentPlan);
  const active = useStore((s) => s.active);
  const workouts = useStore((s) => s.workouts);
  const [selection, setSelection] = useState<{ type: typeof planType; id: string } | null>(null);
  const lastPlanned = [...workouts].reverse().find((w) => plan.some((d) => d.name === w.name));
  const lastIndex = plan.findIndex((d) => d.name === lastPlanned?.name);
  const nextDay = plan[(lastIndex + 1) % Math.max(plan.length, 1)];
  const selected = (selection?.type === planType ? plan.find((d) => d.id === selection.id) : undefined) ?? nextDay;
  const navigate = useNavigate();
  const start = (...args: Parameters<typeof startWorkout>) => { startWorkout(...args); navigate({ to: "/workout" }); };
  return <>
    <PageHeader title="Trening" />
    <div className="space-y-5 p-4">
      {active && <Link to="/workout" className="surface block border-primary p-4"><div className="label-mono">Trening w toku</div><div className="mt-1 font-semibold">{active.name}</div><div className="mt-2 text-sm text-primary">Wróć do treningu →</div></Link>}
      {!planType ? <section className="py-6"><h2 className="text-xl font-semibold">Twój pierwszy trening</h2><p className="mt-2 text-sm text-muted-foreground">Nie wybrałeś jeszcze planu.</p><Button asChild variant="outline" className="mt-4 rounded-full"><Link to="/training-plan">Wybierz plan</Link></Button></section> : <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">Plan {PLAN_TYPES.find((p) => p.id === planType)?.name}</h2><Link to="/training-plan" className="text-sm text-muted-foreground underline">Zmień plan</Link></div>
        {!plan.length && <p className="py-4 text-sm text-muted-foreground">Twój plan jest pusty. <Link to="/plan" className="underline">Dodaj dni treningowe</Link>.</p>}
        <div role="radiogroup" aria-label="Dzień treningowy" className="space-y-3">
          {plan.map((day, index) => <div key={day.id} className={`surface overflow-hidden ${selected?.id === day.id ? "border-primary" : ""}`}>
            <Button role="radio" aria-checked={selected?.id === day.id} variant="ghost" onClick={() => setSelection({ type: planType, id: day.id })} className="h-auto w-full justify-start whitespace-normal rounded-none p-4 text-left hover:bg-secondary hover:text-foreground">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-mono ${selected?.id === day.id ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{selected?.id === day.id ? <Check /> : index + 1}</span>
              <span className="min-w-0 flex-1"><span className="block text-lg font-semibold">{day.name}</span><span className="block text-xs text-muted-foreground">{day.exercises.length} ćwiczeń{day.id === nextDay?.id ? " · Następny w planie" : ""}</span></span>
            </Button>
            {selected?.id === day.id && <ul className="space-y-2 border-t px-4 py-4 text-sm">{day.exercises.map((e, i) => <li key={i} className="flex items-start justify-between gap-4"><span className="text-muted-foreground">{exerciseById(e.exerciseId)?.name}</span><span className="shrink-0 font-mono text-xs">{e.sets} × {e.reps}</span></li>)}</ul>}
          </div>)}
        </div>
      </section>}
      <div className={`grid gap-3 ${selected ? "grid-cols-[1fr_1.2fr]" : "grid-cols-1"}`}>
        <Button disabled={!!active} variant={selected ? "secondary" : "default"} onClick={() => start("Trening dowolny")} className={`h-14 rounded-full px-3 ${selected ? "border border-primary shadow-none" : ""}`}><Plus /><span>Dowolny</span></Button>
        {selected && <Button disabled={!!active} onClick={() => start(selected.name, selected)} className="h-14 rounded-full px-3"><Play /><span>Rozpocznij</span></Button>}
      </div>
    </div>
  </>;
}
