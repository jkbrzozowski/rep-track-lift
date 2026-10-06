import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, LogOut, User } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { PLAN_TYPES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { usePrototype } from "@/lib/prototype";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Twój profil — Dziennik treningowy" }, { name: "description", content: "Dane użytkownika, parametry ciała i plan treningowy." },
    { property: "og:title", content: "Twój profil — Dziennik treningowy" }, { property: "og:description", content: "Dane użytkownika, parametry ciała i plan treningowy." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ProfilePage,
});
function ProfilePage() {
  const planType = useStore((s) => s.planType);
  const { profile, setProfile, demo, setDemo } = usePrototype();
  return <>
    <PageHeader title="Profil" />
    <div className="space-y-7 p-4">
      <div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-secondary"><User className="h-7 w-7 text-primary" /></div><div><h2 className="text-xl font-semibold">{profile.name || "Twój profil"}</h2><p className="mt-1 text-xs text-muted-foreground">{demo ? "Profil testowy" : "Tryb podglądu"}</p></div></div>
      <section className="space-y-4"><h2 className="font-semibold">Dane podstawowe</h2><label className="block space-y-2 text-sm"><span className="text-muted-foreground">Imię</span><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="field w-full p-3" autoComplete="given-name" /></label>
        <div className="grid grid-cols-2 gap-4">{([{ key: "height", label: "Wzrost", unit: "cm" }, { key: "weight", label: "Waga", unit: "kg" }] as const).map((field) => <label key={field.key} className="block space-y-2 text-sm"><span className="text-muted-foreground">{field.label} ({field.unit})</span><input type="number" min="1" step={field.key === "weight" ? "0.1" : "1"} inputMode="decimal" placeholder="—" value={profile[field.key]} onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })} className="field w-full p-3" /></label>)}</div>
      </section>
      <section className="border-t pt-5"><h2 className="mb-3 font-semibold">Trening</h2><Link to="/training-plan" className="flex items-center justify-between py-3"><span><span className="block text-sm text-muted-foreground">Plan treningowy</span><span className="mt-1 block font-semibold">{PLAN_TYPES.find((p) => p.id === planType)?.name ?? "Wybierz plan"}</span></span><ChevronRight className="h-5 w-5" /></Link></section>
      <Button asChild variant="outline" className="rounded-full"><Link to="/login" onClick={() => setDemo(false)}><LogOut />{demo ? "Wyjdź z profilu testowego" : "Ekran logowania"}</Link></Button>
    </div>
  </>;
}
