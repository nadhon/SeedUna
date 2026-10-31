import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { canAccess, roleLabel, type pageAccess } from "@/lib/roles";

export function RequireRole({ page, children }: { page: keyof typeof pageAccess; children: ReactNode }) {
  const { role } = useAuth();
  if (canAccess(role, page)) return <>{children}</>;
  return (
    <div className="mx-auto max-w-md space-y-3 py-16 text-center">
      <Lock className="mx-auto h-10 w-10 text-muted-foreground" />
      <h1 className="text-2xl font-extrabold">Página não disponível</h1>
      <p className="text-muted-foreground">Esta área não faz parte do perfil {role ? roleLabel[role] : ""}.</p>
      <Link to="/" className="inline-block rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground">Voltar ao mapa</Link>
    </div>
  );
}
