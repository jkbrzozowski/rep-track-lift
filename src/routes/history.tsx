import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { exerciseById } from "@/lib/data";
import { fmtDuration, setState, useStore, volume } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historia — Dziennik treningowy" },
      { name: "description", content: "Lista wszystkich zakończonych treningów." },
      { property: "og:title", content: "Historia — Dziennik treningowy" },
      { property: "og:description", content: "Lista wszystkich zakończonych treningów." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const workouts = useStore((s) => s.workouts);
  const [open, setOpen] = useState<string | null>(null);
  const list = [...workouts].reverse();

  return (
    <>
      <PageHeader title="Historia" />
      <div className="space-y-2 p-4">
        {list.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Brak zakończonych treningów.</p>}
        {list.map((w) => (
          <div key={w.id} className="surface">
            <button onClick={() => setOpen(open === w.id ? null : w.id)} className="w-full p-4 text-left">
              <div className="flex justify-between">
                <span className="font-semibold">{w.name}</span>
                <span className="text-sm text-muted-foreground">{new Date(w.startedAt).toLocaleDateString("pl-PL")}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {w.entries.length} ćw. · {fmtDuration((w.endedAt ?? w.startedAt) - w.startedAt)} · {volume(w)} kg
              </div>
            </button>
            {open === w.id && (
              <div className="border-t p-4 text-sm">
                {w.entries.map((e) => (
                  <div key={e.id} className="mb-2">
                    <div className="font-medium">{exerciseById(e.exerciseId)?.name}</div>
                    <div className="text-muted-foreground">{e.sets.map((s) => `${s.weight} kg × ${s.reps}`).join(" · ")}</div>
                  </div>
                ))}
                <button onClick={() => confirm("Usunąć trening?") && setState((s) => ({ ...s, workouts: s.workouts.filter((x) => x.id !== w.id) }))} className="mt-2 text-destructive">
                  Usuń trening
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
