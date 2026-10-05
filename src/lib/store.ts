import { useSyncExternalStore } from "react";
import { PRESET_PLANS, type PlanDay, type PlanType } from "./data";

export type SetEntry = { weight: number; reps: number; done: boolean };
export type WorkoutEntry = { id: string; exerciseId: string; increment: number; sets: SetEntry[] };
export type Workout = {
  id: string;
  name: string;
  startedAt: number;
  endedAt?: number;
  entries: WorkoutEntry[];
};

export type State = {
  planType: PlanType | null;
  customPlan: PlanDay[];
  workouts: Workout[]; // finished
  active: Workout | null;
};

const KEY = "trainlog-v1";
const initial: State = { planType: null, customPlan: [], workouts: [], active: null };
let state: State = initial;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}

export function setState(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return sel(state);
    },
    () => sel(initial),
  );
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function currentPlan(s: State): PlanDay[] {
  if (!s.planType) return [];
  if (s.planType === "custom") return s.customPlan;
  return PRESET_PLANS[s.planType];
}

export function startWorkout(name: string, day?: PlanDay | undefined) {
  setState((s) => ({
    ...s,
    active: {
      id: uid(),
      name,
      startedAt: Date.now(),
      entries: (day?.exercises ?? []).map((pe) => {
        const last = lastSetsFor(s, pe.exerciseId);
        const w = last?.[0]?.weight ?? 0;
        return {
          id: uid(),
          exerciseId: pe.exerciseId,
          increment: 0,
          sets: Array.from({ length: pe.sets }, () => ({ weight: w, reps: pe.reps, done: false })),
        };
      }),
    },
  }));
}

export function lastSetsFor(s: State, exerciseId: string): SetEntry[] | undefined {
  for (let i = s.workouts.length - 1; i >= 0; i--) {
    const e = s.workouts[i].entries.find((x) => x.exerciseId === exerciseId);
    if (e) return e.sets;
  }
}

export function updateActive(fn: (w: Workout) => Workout) {
  setState((s) => (s.active ? { ...s, active: fn(s.active) } : s));
}

export function finishWorkout() {
  setState((s) => {
    if (!s.active) return s;
    const w = { ...s.active, endedAt: Date.now(), entries: s.active.entries.filter((e) => e.sets.length) };
    return { ...s, active: null, workouts: w.entries.length ? [...s.workouts, w] : s.workouts };
  });
}

export const volume = (w: Workout) =>
  w.entries.reduce((a, e) => a + e.sets.filter((x) => x.done).reduce((b, x) => b + x.weight * x.reps, 0), 0);

export const fmtDuration = (ms: number) => {
  const m = Math.floor(ms / 60000);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
};
