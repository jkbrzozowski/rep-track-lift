import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { exerciseById, PLAN_TYPES } from "@/lib/data";
import { currentPlan, startWorkout, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trening — Dziennik treningowy" },
      { name: "description", content: "Rozpocznij trening z planu lub dowolny i zapisuj serie." },
      { property: "og:title", content: "Trening — Dziennik treningowy" },
      { property: "og:description", content: "Rozpocznij trening z planu lub dowolny i zapisuj serie." },
    ],
  }),
  component: TrainingTab,
});

function TrainingTab() {
  const planType = useStore((s) => s.planType);
  const plan = useStore(currentPlan);
  const active = useStore((s) => s.active);
  const navigate = useNavigate();
  const start = (...a: Parameters<typeof startWorkout>) => {
    startWorkout(...a);
    navigate({ to: "/workout" });
  };

  return (
    <>
      <PageHeader title="Trening" />
      <div className="space-y-4 p-4">
        {active && (
          <Link to="/workout" className="block surface border-primary p-4">
            <div className="label-mono">Trening w toku</div>
            <div className="font-semibold">{active.name} · {active.entries.length} ćw.</div>
            <div className="text-sm">Wróć do treningu →</div>
          </Link>
        )}

        {!planType ? (
          <div className="surface p-6 text-center">
            <p className="font-medium">Nie wybrałeś jeszcze planu</p>
            <p className="mt-1 text-sm text-muted-foreground">Wybierz plan w profilu lub zacznij trening dowolny.</p>
            <Link to="/profile" className="mt-4 inline-block btn-ghost px-4 py-2">Wybierz plan</Link>
          </div>
        ) : (
          <section>
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="font-semibold">Plan: {PLAN_TYPES.find((p) => p.id === planType)?.name}</h2>
              <Link to={planType === "custom" ? "/plan" : "/profile"} className="text-sm underline">
                {planType === "custom" ? "Edytuj plan" : "Zmień"}
              </Link>
            </div>
            {plan.length === 0 && (
              <p className="surface p-4 text-sm text-muted-foreground">
                Twój plan jest pusty. <Link to="/plan" className="underline">Dodaj dni treningowe</Link>.
              </p>
            )}
            <div className="space-y-2">
              {plan.map((d) => (
                <div key={d.id} className="surface p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{d.name}</h3>
                    <button disabled={!!active} onClick={() => start(d.name, d)} className="btn-accent px-4 py-2 text-sm disabled:opacity-40">
                      Rozpocznij
                    </button>
                  </div>
                  <ul className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                    {d.exercises.map((e, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{exerciseById(e.exerciseId)?.name}</span>
                        <span>{e.sets} × {e.reps}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <button disabled={!!active} onClick={() => start("Trening dowolny")} className="btn-accent w-full p-4 text-base disabled:opacity-40">
          + Trening dowolny
        </button>
      </div>
    </>
  );
}
