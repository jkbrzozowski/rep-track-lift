import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { ExercisePicker } from "@/components/ExercisePicker";
import { exerciseById, type PlanDay } from "@/lib/data";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Własny plan — Dziennik treningowy" },
      { name: "description", content: "Ułóż własne dni treningowe i ćwiczenia." },
      { property: "og:title", content: "Własny plan — Dziennik treningowy" },
      { property: "og:description", content: "Ułóż własne dni treningowe i ćwiczenia." },
    ],
  }),
  component: PlanEditor,
});

const swap = (ds: PlanDay[], i: number, j: number) => { const a = [...ds]; const t = a[i]!; a[i] = a[j]!; a[j] = t; return a; };
const save = (fn: (d: PlanDay[]) => PlanDay[]) => setState((s) => ({ ...s, planType: "custom", customPlan: fn(s.customPlan) }));

function PlanEditor() {
  const days = useStore((s) => s.customPlan);
  const [pickFor, setPickFor] = useState<string | null>(null);
  const updDay = (id: string, fn: (d: PlanDay) => PlanDay) => save((ds) => ds.map((d) => (d.id === id ? fn(d) : d)));

  return (
    <>
      <PageHeader title="Własny plan" left={<Link to="/" className="text-sm">← Wróć</Link>} />
      <div className="space-y-3 p-4">
        {days.map((d, di) => (
          <div key={d.id} className="surface">
            <div className="flex items-center gap-2 border-b p-3">
              <input value={d.name} onChange={(e) => updDay(d.id, (x) => ({ ...x, name: e.target.value }))} className="min-w-0 flex-1 field px-2 py-1 font-semibold" />
              <button disabled={di === 0} onClick={() => save((ds) => swap(ds, di, di - 1))} className="px-2 disabled:opacity-30">↑</button>
              <button disabled={di === days.length - 1} onClick={() => save((ds) => swap(ds, di, di + 1))} className="px-2 disabled:opacity-30">↓</button>
              <button onClick={() => confirm("Usunąć dzień?") && save((ds) => ds.filter((x) => x.id !== d.id))} className="px-2 text-destructive">×</button>
            </div>
            <div className="p-3">
              {d.exercises.map((e, i) => (
                <div key={i} className="mb-2 grid grid-cols-[minmax(0,1fr)_3.5rem_auto_3.5rem_auto] items-center gap-2 text-sm">
                  <span className="truncate">{exerciseById(e.exerciseId)?.name}</span>
                  <input type="number" value={e.sets} onChange={(ev) => updDay(d.id, (x) => ({ ...x, exercises: x.exercises.map((y, j) => (j === i ? { ...y, sets: Number(ev.target.value) } : y)) }))} className="field px-2 py-1" />
                  <span>×</span>
                  <input type="number" value={e.reps} onChange={(ev) => updDay(d.id, (x) => ({ ...x, exercises: x.exercises.map((y, j) => (j === i ? { ...y, reps: Number(ev.target.value) } : y)) }))} className="field px-2 py-1" />
                  <button onClick={() => updDay(d.id, (x) => ({ ...x, exercises: x.exercises.filter((_, j) => j !== i) }))} className="text-muted-foreground">×</button>
                </div>
              ))}
              <button onClick={() => setPickFor(d.id)} className="text-sm underline">+ Dodaj ćwiczenie</button>
            </div>
          </div>
        ))}
        <button onClick={() => save((ds) => [...ds, { id: uid(), name: `Dzień ${ds.length + 1}`, exercises: [] }])} className="btn-accent w-full p-4 text-base">
          + Dodaj dzień treningowy
        </button>
      </div>
      {pickFor && (
        <ExercisePicker onClose={() => setPickFor(null)} onPick={(id) => { updDay(pickFor, (x) => ({ ...x, exercises: [...x.exercises, { exerciseId: id, sets: 3, reps: 10 }] })); setPickFor(null); }} />
      )}
    </>
  );
}
