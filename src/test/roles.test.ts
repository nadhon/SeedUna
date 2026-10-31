import { describe, expect, it } from "vitest";
import { canAccess } from "@/lib/roles";

describe("page access by user type", () => {
  it("trabalhador sees the job board but not producer or city hall panels", () => {
    expect(canAccess("trabalhador", "/mural")).toBe(true);
    expect(canAccess("trabalhador", "/produtor")).toBe(false);
    expect(canAccess("trabalhador", "/prefeitura")).toBe(false);
  });
  it("prefeitura sees its dashboard and the job board", () => {
    expect(canAccess("prefeitura", "/prefeitura")).toBe(true);
    expect(canAccess("prefeitura", "/mural")).toBe(true);
    expect(canAccess("prefeitura", "/produtor")).toBe(false);
  });
  it("produtor sees its panel but not city hall", () => {
    expect(canAccess("produtor", "/produtor")).toBe(true);
    expect(canAccess("produtor", "/prefeitura")).toBe(false);
  });
  it("no role means no private page", () => {
    expect(canAccess(null, "/mural")).toBe(false);
  });
});
