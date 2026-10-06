import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { PLAN_TYPES } from "@/lib/data";
import { setState, useStore } from "@/lib/store";
export const Route = createFileRoute("/training-plan")({
  head: () => ({ meta: [
    { title: "Wybór planu — Dziennik treningowy" }, { name: "description", content: "Wybierz PPL, Split, FBW, Calisthenics lub własny plan." },
    { property: "og:title", content: "Wybór planu — Dziennik treningowy" }, { property: "og:description", content: "Wybierz PPL, Split, FBW, Calisthenics lub własny plan." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: TrainingPlanPage,
});
function TrainingPlanPage() {
  const planType = useStore((s) => s.planType);
  return <><PageHeader title="Plan treningowy" left={<Link to="/profile" className="text-sm">← Profil</Link>} /><div className="space-y-3 p-4">{PLAN_TYPES.map((p) => <label key={p.id} className={`surface flex cursor-pointer items-start gap-3 p-4 ${planType === p.id ? "border-primary" : ""}`}><input type="radio" name="plan" checked={planType === p.id} onChange={() => setState((s) => ({ ...s, planType: p.id }))} className="mt-1 accent-primary" /><span><span className="block font-semibold">{p.name}</span><span className="mt-1 block text-sm text-muted-foreground">{p.description}</span></span></label>)}{planType === "custom" && <Button asChild variant="outline"><Link to="/plan">Edytuj własny plan</Link></Button>}<Button asChild className="h-12 w-full rounded-full"><Link to="/">Wróć do treningu</Link></Button></div></>;
}
