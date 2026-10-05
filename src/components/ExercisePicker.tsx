import { useMemo, useState } from "react";
import { EXERCISES, MUSCLE_GROUPS, groupName, type MuscleGroup } from "@/lib/data";

export function ExercisePicker({ onPick, onClose }: { onPick: (id: string) => void; onClose: () => void }) {
  const [group, setGroup] = useState<MuscleGroup | null>(null);
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return EXERCISES.filter((e) => (!group || e.group === group) && (!query || e.name.toLowerCase().includes(query)));
  }, [group, q]);
  const showGroups = !group && !q;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background md:inset-auto md:left-1/2 md:top-10 md:h-[80vh] md:w-[480px] md:-translate-x-1/2 md:rounded-lg md:border md:shadow-lg">
      <div className="flex items-center gap-2 border-b p-3">
        <button className="px-2 py-1 text-sm" onClick={group ? () => setGroup(null) : onClose}>
          {group ? "← Partie" : "Zamknij"}
        </button>
        <h2 className="flex-1 text-center font-semibold">{group ? groupName(group) : "Dodaj ćwiczenie"}</h2>
        <span className="w-16" />
      </div>
      <div className="border-b p-3">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={group ? `Szukaj w: ${groupName(group)}` : "Szukaj ćwiczenia…"}
          className="w-full rounded-md border bg-background px-3 py-2"
        />
        {!showGroups && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            <Chip active={!group} onClick={() => setGroup(null)}>Wszystkie</Chip>
            {MUSCLE_GROUPS.map((m) => (
              <Chip key={m.id} active={group === m.id} onClick={() => setGroup(m.id)}>{m.name}</Chip>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {showGroups ? (
          <>
            <p className="px-4 pt-3 text-xs uppercase text-muted-foreground">1. Wybierz partię</p>
            <div className="grid grid-cols-2 gap-2 p-3">
              {MUSCLE_GROUPS.map((m) => (
                <button key={m.id} onClick={() => setGroup(m.id)} className="rounded-md border p-4 text-left">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{EXERCISES.filter((e) => e.group === m.id).length} ćwiczeń</div>
                </button>
              ))}
            </div>
          </>
        ) : list.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Brak wyników</p>
        ) : (
          <ul>
            {list.map((e) => (
              <li key={e.id}>
                <button onClick={() => onPick(e.id)} className="flex w-full justify-between border-b px-4 py-3 text-left">
                  <span>{e.name}</span>
                  {!group && <span className="text-xs text-muted-foreground">{groupName(e.group)}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-sm ${active ? "bg-primary text-primary-foreground" : ""}`}
    >
      {children}
    </button>
  );
}
