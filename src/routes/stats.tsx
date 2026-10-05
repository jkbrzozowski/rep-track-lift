import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { exerciseById } from "@/lib/data";
import { useStore, volume } from "@/lib/store";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Statystyki — Dziennik treningowy" },
      { name: "description", content: "Postępy w ćwiczeniach: rekordy i historia ciężarów." },
      { property: "og:title", content: "Statystyki — Dziennik treningowy" },
      { property: "og:description", content: "Postępy w ćwiczeniach: rekordy i historia ciężarów." },
    ],
  }),
  component: StatsPage,
});

function StatsPage() {
  const workouts = useStore((s) => s.workouts);
  const byExercise = useMemo(() => {
    const m = new Map<string, { date: number; max: number }[]>();
    for (const w of workouts)
      for (const e of w.entries) {
        const max = Math.max(0, ...e.sets.map((s) => s.weight));
        m.set(e.exerciseId, [...(m.get(e.exerciseId) ?? []), { date: w.startedAt, max }]);
      }
    return [...m.entries()];
  }, [workouts]);
  const [sel, setSel] = useState<string | null>(null);
  const totalVol = workouts.reduce((a, w) => a + volume(w), 0);

  return (
    <>
      <PageHeader title="Statystyki" />
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="tile p-4"><div className="text-sm font-semibold">Treningi</div><div className="display mt-6 text-6xl">{workouts.length}</div></div>
          <div className="tile p-4"><div className="text-sm font-semibold">Objętość</div><div className="display mt-6 text-6xl">{totalVol}</div><div className="label-mono">kg łącznie</div></div>
        </div>
        <h2 className="font-semibold">Ćwiczenia</h2>
        {byExercise.length === 0 && <p className="text-sm text-muted-foreground">Zakończ pierwszy trening, by zobaczyć postępy.</p>}
        {byExercise.map(([id, pts]) => {
          const best = Math.max(...pts.map((p) => p.max));
          const top = Math.max(best, 1);
          return (
            <div key={id} className="surface">
              <button onClick={() => setSel(sel === id ? null : id)} className="flex w-full justify-between p-4 text-left">
                <span className="font-medium">{exerciseById(id)?.name}</span>
                <span className="text-sm text-muted-foreground">Rekord: {best} kg</span>
              </button>
              {sel === id && (
                <div className="flex h-32 items-end gap-1 border-t p-4">
                  {pts.slice(-20).map((p, i) => (
                    <div key={i} className="flex-1 rounded-t bg-primary" style={{ height: `${(p.max / top) * 100}%` }} title={`${new Date(p.date).toLocaleDateString("pl-PL")}: ${p.max} kg`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
