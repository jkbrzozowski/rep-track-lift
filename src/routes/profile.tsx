import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { PLAN_TYPES } from "@/lib/data";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — Dziennik treningowy" },
      { name: "description", content: "Wybierz plan treningowy: PPL, Split, FBW, Calisthenics lub własny." },
      { property: "og:title", content: "Profil — Dziennik treningowy" },
      { property: "og:description", content: "Wybierz plan treningowy: PPL, Split, FBW, Calisthenics lub własny." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const planType = useStore((s) => s.planType);
  return (
    <>
      <PageHeader title="Profil" />
      <div className="space-y-4 p-4">
        <section>
          <h2 className="mb-2 font-semibold">Plan treningowy</h2>
          <div className="space-y-2">
            {PLAN_TYPES.map((p) => (
              <label key={p.id} className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${planType === p.id ? "border-primary border-2" : ""}`}>
                <input type="radio" name="plan" checked={planType === p.id} onChange={() => setState((s) => ({ ...s, planType: p.id }))} className="mt-1" />
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.description}</div>
                </div>
              </label>
            ))}
          </div>
          {planType === "custom" && <Link to="/plan" className="mt-3 inline-block underline">Edytuj własny plan →</Link>}
        </section>
      </div>
    </>
  );
}
