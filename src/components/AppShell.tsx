import { Link } from "@tanstack/react-router";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Map, Sprout, Briefcase, Landmark, Wifi, WifiOff, CloudOff, UserRound, LogIn } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/use-auth";
import { canAccess } from "@/lib/roles";

const OfflineCtx = createContext<{ offline: boolean }>({ offline: false });
export const useOffline = () => useContext(OfflineCtx).offline;

const allNav = [
  { to: "/", label: "Mapa", icon: Map },
  { to: "/produtor", label: "Produtor", icon: Sprout },
  { to: "/mural", label: "Mural", icon: Briefcase },
  { to: "/prefeitura", label: "Prefeitura", icon: Landmark },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [offline, setOffline] = useState(false);
  const { user, role, avatarSrc } = useAuth();
  const nav = allNav.filter((n) => n.to === "/" || canAccess(role, n.to));
  const mobileNav = [...nav, user
    ? { to: "/perfil" as const, label: "Perfil", icon: UserRound }
    : { to: "/auth" as const, label: "Entrar", icon: LogIn }];

  return (
    <OfflineCtx.Provider value={{ offline }}>
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SeedUna" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-2xl font-bold text-primary">SeedUna</span>
          </Link>
          <nav className="ml-6 hidden gap-1 md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
                className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-muted-foreground hover:bg-secondary"
                activeProps={{ className: "bg-secondary text-primary" }}>
                <n.icon className="h-5 w-5" />{n.label}
              </Link>
            ))}
          </nav>
          <button onClick={() => setOffline((o) => !o)} aria-pressed={offline}
            className={`ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${offline ? "bg-accent text-accent-foreground" : "bg-secondary text-primary"}`}>
            {offline ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
            <span className="hidden sm:inline">{offline ? "Modo Offline" : "Modo Online"}</span>
          </button>
          {user ? (
            <Link to="/perfil" aria-label="Meu perfil" className="hidden md:block">
              {avatarSrc
                ? <img src={avatarSrc} alt="" className="h-10 w-10 rounded-full border-2 border-primary object-cover" />
                : <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary"><UserRound className="h-5 w-5" /></span>}
            </Link>
          ) : (
            <Link to="/auth" className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground md:flex">
              <LogIn className="h-4 w-4" />Entrar
            </Link>
          )}
        </div>
        {offline && (
          <div className="flex items-center justify-center gap-2 bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground">
            <CloudOff className="h-4 w-4 shrink-0" />
            Sem sinal? Tudo bem! Seus dados estão salvos no aparelho e serão enviados quando a internet voltar.
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:pb-10">{children}</main>
      <footer className="hidden pb-8 text-center text-sm text-muted-foreground md:block">SeedUna • desenvolvido pelo grupo Os Wilsons</footer>
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-card md:hidden">
        {mobileNav.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-bold text-muted-foreground"
            activeProps={{ className: "text-primary bg-secondary" }}>
            <n.icon className="h-6 w-6" />{n.label}
          </Link>
        ))}
      </nav>
    </OfflineCtx.Provider>
  );
}

export function SyncNote({ text }: { text: string }) {
  const offline = useOffline();
  return <>{offline ? `${text} Salvo no aparelho — será sincronizado quando houver sinal.` : `${text} Enviado com sucesso!`}</>;
}
