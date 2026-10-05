import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function TrainingCalendar({ dates }: { dates: number[] }) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const trained = new Set(dates.map((t) => key(new Date(t))));
  const offset = (cursor.getDay() + 6) % 7;
  const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const today = key(new Date());
  const monthCount = Array.from({ length: count }, (_, i) => key(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))).filter((k) => trained.has(k)).length;
  const shift = (n: number) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + n, 1));

  return (
    <div className="surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="display text-3xl">{cursor.toLocaleDateString("pl-PL", { month: "long" })}</div>
          <div className="label-mono">{cursor.getFullYear()} · {monthCount} treningów</div>
        </div>
        <div className="flex gap-2">
          <button aria-label="Poprzedni miesiąc" onClick={() => shift(-1)} className="btn-ghost grid h-10 w-10 place-items-center"><ChevronLeft className="h-4 w-4" /></button>
          <button aria-label="Następny miesiąc" onClick={() => shift(1)} className="btn-ghost grid h-10 w-10 place-items-center"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {DAYS.map((d) => <div key={d} className="label-mono pb-1">{d}</div>)}
        {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: count }, (_, i) => {
          const k = key(new Date(cursor.getFullYear(), cursor.getMonth(), i + 1));
          const on = trained.has(k);
          return (
            <div key={k} className={`grid aspect-square place-items-center rounded-lg font-mono text-sm ${on ? "bg-primary font-semibold text-primary-foreground" : "bg-muted text-muted-foreground"} ${k === today ? "ring-1 ring-foreground" : ""}`}>
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
