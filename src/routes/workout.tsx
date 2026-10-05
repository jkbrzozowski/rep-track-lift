import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { ExercisePicker } from "@/components/ExercisePicker";
import { exerciseById, groupName } from "@/lib/data";
import { finishWorkout, fmtDuration, lastSetsFor, uid, updateActive, useStore, volume, type WorkoutEntry } from "@/lib/store";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Aktywny trening — Dziennik treningowy" },
      { name: "description", content: "Zapisuj ćwiczenia, ciężar, powtórzenia i progresję między seriami." },
      { property: "og:title", content: "Aktywny trening — Dziennik treningowy" },
      { property: "og:description", content: "Zapisuj ćwiczenia, ciężar, powtórzenia i progresję między seriami." },
    ],
  }),
  component: WorkoutPage,
});

function WorkoutPage() {
  const active = useStore((s) => s.active);
  const state = useStore((s) => s);
  const [picker, setPicker] = useState(false);
  const [now, setNow] = useState(Date.now());
  const navigate = useNavigate();
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  if (!active)
    return (
      <>
        <PageHeader title="Trening" />
        <div className="p-6 text-center">
          <p>Brak aktywnego treningu.</p>
          <Link to="/" className="mt-3 inline-block underline">Rozpocznij trening</Link>
        </div>
      </>
    );

  const setEntry = (id: string, fn: (e: WorkoutEntry) => WorkoutEntry) =>
    updateActive((w) => ({ ...w, entries: w.entries.map((e) => (e.id === id ? fn(e) : e)) }));

  const addExercise = (exerciseId: string) => {
    const last = lastSetsFor(state, exerciseId);
    updateActive((w) => ({
      ...w,
      entries: [...w.entries, { id: uid(), exerciseId, increment: 0, sets: [{ weight: last?.[0]?.weight ?? 0, reps: last?.[0]?.reps ?? 10, done: false }] }],
    }));
    setPicker(false);
  };

  const finish = () => {
    if (!confirm("Zakończyć trening?")) return;
    finishWorkout();
    navigate({ to: "/history" });
  };

  return (
    <>
      <PageHeader
        title={active.name}
        left={<Link to="/" className="text-sm">← Wróć</Link>}
        right={<button onClick={finish} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">Zakończ</button>}
      />
      <div className="flex justify-around border-b p-3 text-center text-sm">
        <div><div className="text-muted-foreground">Czas</div><div className="font-semibold">{fmtDuration(now - active.startedAt)}</div></div>
        <div><div className="text-muted-foreground">Ćwiczenia</div><div className="font-semibold">{active.entries.length}</div></div>
        <div><div className="text-muted-foreground">Objętość</div><div className="font-semibold">{volume(active)} kg</div></div>
      </div>

      <div className="space-y-3 p-4">
        {active.entries.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">Trening nie zawiera ćwiczeń. Dodaj pierwsze poniżej.</p>
        )}
        {active.entries.map((e) => (
          <EntryCard key={e.id} entry={e} prev={lastSetsFor(state, e.exerciseId)} onChange={(fn) => setEntry(e.id, fn)}
            onRemove={() => updateActive((w) => ({ ...w, entries: w.entries.filter((x) => x.id !== e.id) }))} />
        ))}
        <button onClick={() => setPicker(true)} className="w-full rounded-md border-2 border-dashed p-4 font-medium">+ Dodaj ćwiczenie</button>
      </div>
      {picker && <ExercisePicker onPick={addExercise} onClose={() => setPicker(false)} />}
    </>
  );
}

function EntryCard({ entry, prev, onChange, onRemove }: {
  entry: WorkoutEntry; prev?: { weight: number; reps: number }[] | undefined;
  onChange: (fn: (e: WorkoutEntry) => WorkoutEntry) => void; onRemove: () => void;
}) {
  const ex = exerciseById(entry.exerciseId);
  const setSet = (i: number, patch: Partial<WorkoutEntry["sets"][number]>) =>
    onChange((e) => ({ ...e, sets: e.sets.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  const addSet = () =>
    onChange((e) => {
      const last = e.sets[e.sets.length - 1] ?? { weight: 0, reps: 10 };
      return { ...e, sets: [...e.sets, { weight: last.weight + e.increment, reps: last.reps, done: false }] };
    });

  return (
    <div className="rounded-md border">
      <div className="flex items-start justify-between gap-2 border-b p-3">
        <div className="min-w-0">
          <div className="font-semibold">{ex?.name}</div>
          <div className="text-xs text-muted-foreground">
            {ex && groupName(ex.group)}
            {prev && ` · Ostatnio: ${prev.map((s) => `${s.weight}×${s.reps}`).join(", ")}`}
          </div>
        </div>
        <button onClick={onRemove} className="shrink-0 text-sm text-destructive">Usuń</button>
      </div>
      <div className="p-3">
        <div className="mb-1 grid grid-cols-[2rem_1fr_1fr_3rem_2rem] gap-2 text-xs text-muted-foreground">
          <span>Seria</span><span>kg</span><span>Powt.</span><span className="text-center">✓</span><span />
        </div>
        {entry.sets.map((s, i) => (
          <div key={i} className={`mb-1 grid grid-cols-[2rem_1fr_1fr_3rem_2rem] items-center gap-2 ${s.done ? "opacity-60" : ""}`}>
            <span className="text-center text-sm">{i + 1}</span>
            <input type="number" inputMode="decimal" step="0.5" value={s.weight} onChange={(ev) => setSet(i, { weight: Number(ev.target.value) })} className="w-full rounded-md border bg-background px-2 py-2" />
            <input type="number" inputMode="numeric" value={s.reps} onChange={(ev) => setSet(i, { reps: Number(ev.target.value) })} className="w-full rounded-md border bg-background px-2 py-2" />
            <button onClick={() => setSet(i, { done: !s.done })} className={`h-9 rounded-md border ${s.done ? "bg-primary text-primary-foreground" : ""}`}>✓</button>
            <button onClick={() => onChange((e) => ({ ...e, sets: e.sets.filter((_, j) => j !== i) }))} className="text-muted-foreground">×</button>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between gap-2">
          <button onClick={addSet} className="rounded-md border px-3 py-1.5 text-sm">+ Seria</button>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Progresja / seria
            <input type="number" inputMode="decimal" step="0.5" value={entry.increment} onChange={(ev) => onChange((e) => ({ ...e, increment: Number(ev.target.value) }))} className="w-16 rounded-md border bg-background px-2 py-1" />
            kg
          </label>
        </div>
      </div>
    </div>
  );
}
