export type MuscleGroup =
  | "chest" | "back" | "shoulders" | "biceps" | "triceps" | "legs" | "glutes" | "core" | "calves" | "fullbody";

export const MUSCLE_GROUPS: { id: MuscleGroup; name: string }[] = [
  { id: "chest", name: "Klatka" },
  { id: "back", name: "Plecy" },
  { id: "shoulders", name: "Barki" },
  { id: "biceps", name: "Biceps" },
  { id: "triceps", name: "Triceps" },
  { id: "legs", name: "Nogi" },
  { id: "glutes", name: "Pośladki" },
  { id: "calves", name: "Łydki" },
  { id: "core", name: "Brzuch" },
  { id: "fullbody", name: "Całe ciało" },
];

export type Exercise = { id: string; name: string; group: MuscleGroup; bodyweight?: boolean };

const ex = (group: MuscleGroup, names: string[], bodyweight = false): Exercise[] =>
  names.map((name) => ({ id: name.toLowerCase().replace(/[^a-z0-9ąćęłńóśźż]+/g, "-"), name, group, bodyweight }));

export const EXERCISES: Exercise[] = [
  ...ex("chest", ["Wyciskanie sztangi na ławce płaskiej", "Wyciskanie hantli na skosie", "Wyciskanie na skosie dodatnim", "Rozpiętki z hantlami", "Rozpiętki na bramie", "Butterfly (maszyna)"]),
  ...ex("chest", ["Pompki", "Dipy na poręczach"], true),
  ...ex("back", ["Martwy ciąg", "Wiosłowanie sztangą", "Wiosłowanie hantlem", "Ściąganie drążka wyciągu górnego", "Wiosłowanie na wyciągu dolnym", "Face pull"]),
  ...ex("back", ["Podciąganie nachwytem", "Podciąganie podchwytem", "Australijskie podciąganie", "Muscle up"], true),
  ...ex("shoulders", ["Wyciskanie żołnierskie (OHP)", "Wyciskanie hantli siedząc", "Unoszenie hantli bokiem", "Unoszenie hantli w przód", "Odwrotne rozpiętki"]),
  ...ex("shoulders", ["Pompki w staniu na rękach", "Pike push-up"], true),
  ...ex("biceps", ["Uginanie ramion ze sztangą", "Uginanie z hantlami (młotkowe)", "Uginanie na modlitewniku", "Uginanie na wyciągu"]),
  ...ex("triceps", ["Prostowanie ramion na wyciągu", "Wyciskanie francuskie", "Wyciskanie wąskim chwytem", "Prostowanie ramienia za głową"]),
  ...ex("triceps", ["Pompki diamentowe", "Dipy na ławce"], true),
  ...ex("legs", ["Przysiad ze sztangą", "Przysiad przedni", "Wypychanie na suwnicy", "Prostowanie nóg na maszynie", "Uginanie nóg na maszynie", "Rumuński martwy ciąg", "Wykroki z hantlami", "Przysiad bułgarski"]),
  ...ex("legs", ["Przysiad z masą ciała", "Pistol squat"], true),
  ...ex("glutes", ["Hip thrust", "Odwodzenie nóg na maszynie", "Kickback na wyciągu"]),
  ...ex("calves", ["Wspięcia na palce stojąc", "Wspięcia na palce siedząc"]),
  ...ex("core", ["Plank", "Unoszenie nóg w zwisie", "Brzuszki", "Ab roller", "Russian twist"], true),
  ...ex("fullbody", ["Burpees", "Zarzut sztangi (clean)", "Kettlebell swing"]),
];

export const exerciseById = (id: string) => EXERCISES.find((e) => e.id === id);
export const groupName = (g: MuscleGroup) => MUSCLE_GROUPS.find((m) => m.id === g)?.name ?? g;

export type PlanExercise = { exerciseId: string; sets: number; reps: number };
export type PlanDay = { id: string; name: string; exercises: PlanExercise[] };
export type PlanType = "custom" | "ppl" | "calisthenics" | "split" | "fbw";

const byName = (n: string) => EXERCISES.find((e) => e.name === n)!.id;
const day = (name: string, items: [string, number, number][]): PlanDay => ({
  id: name.toLowerCase().replace(/\s+/g, "-"),
  name,
  exercises: items.map(([n, sets, reps]) => ({ exerciseId: byName(n), sets, reps })),
});

export const PLAN_TYPES: { id: PlanType; name: string; description: string }[] = [
  { id: "ppl", name: "PPL", description: "Push / Pull / Legs – 3 dni rotacyjnie" },
  { id: "split", name: "Split", description: "Każda partia osobno – 5 dni" },
  { id: "fbw", name: "FBW", description: "Full Body Workout – całe ciało na każdym treningu" },
  { id: "calisthenics", name: "Calisthenics", description: "Trening z masą własnego ciała" },
  { id: "custom", name: "Własny", description: "Sam układasz dni i ćwiczenia" },
];

export const PRESET_PLANS: Record<Exclude<PlanType, "custom">, PlanDay[]> = {
  ppl: [
    day("Push", [["Wyciskanie sztangi na ławce płaskiej", 4, 8], ["Wyciskanie żołnierskie (OHP)", 4, 8], ["Unoszenie hantli bokiem", 3, 12], ["Prostowanie ramion na wyciągu", 3, 12]]),
    day("Pull", [["Martwy ciąg", 3, 5], ["Wiosłowanie sztangą", 4, 8], ["Ściąganie drążka wyciągu górnego", 3, 10], ["Uginanie ramion ze sztangą", 3, 10]]),
    day("Legs", [["Przysiad ze sztangą", 4, 8], ["Rumuński martwy ciąg", 3, 10], ["Prostowanie nóg na maszynie", 3, 12], ["Wspięcia na palce stojąc", 4, 15]]),
  ],
  split: [
    day("Klatka", [["Wyciskanie sztangi na ławce płaskiej", 4, 8], ["Wyciskanie hantli na skosie", 3, 10], ["Rozpiętki na bramie", 3, 12]]),
    day("Plecy", [["Martwy ciąg", 3, 5], ["Podciąganie nachwytem", 4, 8], ["Wiosłowanie hantlem", 3, 10]]),
    day("Barki", [["Wyciskanie żołnierskie (OHP)", 4, 8], ["Unoszenie hantli bokiem", 4, 12], ["Face pull", 3, 15]]),
    day("Ramiona", [["Uginanie ramion ze sztangą", 4, 10], ["Wyciskanie francuskie", 4, 10], ["Uginanie z hantlami (młotkowe)", 3, 12]]),
    day("Nogi", [["Przysiad ze sztangą", 4, 8], ["Wypychanie na suwnicy", 3, 10], ["Uginanie nóg na maszynie", 3, 12]]),
  ],
  fbw: [
    day("FBW A", [["Przysiad ze sztangą", 3, 8], ["Wyciskanie sztangi na ławce płaskiej", 3, 8], ["Wiosłowanie sztangą", 3, 8]]),
    day("FBW B", [["Martwy ciąg", 3, 5], ["Wyciskanie żołnierskie (OHP)", 3, 8], ["Podciąganie nachwytem", 3, 8]]),
  ],
  calisthenics: [
    day("Push", [["Pompki", 3, 15], ["Dipy na poręczach", 3, 10], ["Pike push-up", 3, 10]]),
    day("Pull", [["Podciąganie nachwytem", 3, 8], ["Podciąganie podchwytem", 3, 8], ["Australijskie podciąganie", 3, 12]]),
    day("Legs", [["Przysiad z masą ciała", 3, 20], ["Pistol squat", 3, 6], ["Plank", 3, 60]]),
  ],
};
