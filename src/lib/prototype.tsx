import { createContext, useContext, useState, type ReactNode } from "react";

type Profile = { name: string; height: string; weight: string };
type Prototype = { profile: Profile; setProfile: (profile: Profile) => void; demo: boolean; setDemo: (demo: boolean) => void };
const PrototypeContext = createContext<Prototype | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({ name: "Jakub", height: "", weight: "" });
  const [demo, setDemo] = useState(true);
  return <PrototypeContext.Provider value={{ profile, setProfile, demo, setDemo }}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) throw new Error("PrototypeProvider is required");
  return context;
}