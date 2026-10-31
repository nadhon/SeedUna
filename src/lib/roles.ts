export type Role = "produtor" | "trabalhador" | "prefeitura";

export const roleLabel: Record<Role, string> = {
  produtor: "Produtor",
  trabalhador: "Trabalhador",
  prefeitura: "Prefeitura",
};

/** Which private pages each type of user can open. The map (/) is public. */
export const pageAccess: Record<"/produtor" | "/mural" | "/prefeitura", Role[]> = {
  "/produtor": ["produtor"],
  "/mural": ["produtor", "trabalhador", "prefeitura"],
  "/prefeitura": ["prefeitura"],
};

export function canAccess(role: Role | null | undefined, page: keyof typeof pageAccess) {
  return !!role && pageAccess[page].includes(role);
}
