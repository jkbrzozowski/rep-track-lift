import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrototype } from "@/lib/prototype";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Logowanie — Lift.Log" }, { name: "description", content: "Ekran logowania do dziennika treningowego i dostęp testowy." },
    { property: "og:title", content: "Logowanie — Lift.Log" }, { property: "og:description", content: "Ekran logowania do dziennika treningowego i dostęp testowy." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: LoginPage,
});
function LoginPage() {
  const { setDemo } = usePrototype();
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState(false);
  const navigate = useNavigate();
  return <div className="px-6 pb-8 pt-10"><Link to="/profile" className="text-sm text-muted-foreground">← Wróć</Link><div className="display mb-12 mt-12 text-6xl">Lift<span className="text-primary">.</span>Log</div><h1 className="text-2xl font-semibold">Zaloguj się</h1><p className="mt-2 text-sm text-muted-foreground">Prototyp · logowanie demonstracyjne</p><form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); setNotice(true); }}><label className="block space-y-2 text-sm"><span>E-mail</span><input type="email" required autoComplete="email" placeholder="twoj@email.pl" className="field w-full p-3" /></label><label className="block space-y-2 text-sm"><span>Hasło</span><div className="relative"><input type={show ? "text" : "password"} required autoComplete="current-password" placeholder="Hasło" className="field w-full py-3 pl-3 pr-14" /><Button type="button" size="icon" variant="ghost" aria-label={show ? "Ukryj hasło" : "Pokaż hasło"} onClick={() => setShow(!show)} className="absolute right-2 top-1.5">{show ? <EyeOff /> : <Eye />}</Button></div></label><Button className="h-12 w-full rounded-full" type="submit">Zaloguj się<ArrowRight /></Button>{notice && <p role="status" className="text-sm text-muted-foreground">Logowanie do konta nie jest jeszcze aktywne. Skorzystaj z wejścia testowego.</p>}</form><div className="my-7 flex items-center gap-4 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />lub<span className="h-px flex-1 bg-border" /></div><Button variant="secondary" className="h-12 w-full rounded-full border border-primary" onClick={() => { setDemo(true); navigate({ to: "/" }); }}><User />Wejdź testowo</Button></div>;
}
