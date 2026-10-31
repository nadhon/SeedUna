import produce from "@/assets/produce.jpg";
import dairy from "@/assets/dairy.jpg";

export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export type PinType = "produtor" | "comercio" | "alerta";
export const pins: { id: number; type: PinType; name: string; info: string; x: number; y: number }[] = [
  { id: 1, type: "produtor", name: "Sítio São José", info: "Seu Antônio • Macaxeira e milho", x: 30, y: 15 },
  { id: 2, type: "produtor", name: "Sítio Boa Esperança", info: "Dona Maria • Frutas da estação", x: 20, y: 60 },
  { id: 3, type: "produtor", name: "Fazenda Riacho Doce", info: "Família Lima • Queijo coalho e leite", x: 64, y: 55 },
  { id: 4, type: "produtor", name: "Sítio Pé de Serra", info: "Seu Raimundo • Feijão verde", x: 85, y: 80 },
  { id: 5, type: "comercio", name: "Mercadinho Central", info: "Ponto de apoio para retirada", x: 88, y: 18 },
  { id: 6, type: "comercio", name: "Padaria Pão Nosso", info: "Parceira verificada", x: 78, y: 32 },
  { id: 7, type: "alerta", name: "Estrada do Sítio São José", info: "Trânsito lento • Barro após chuva", x: 42, y: 24 },
  { id: 8, type: "alerta", name: "Ponte do Riacho", info: "Atenção • Passagem estreita", x: 63, y: 22 },
  { id: 9, type: "alerta", name: "Vicinal PE-08 km 4", info: "Buracos • Reportado hoje", x: 77, y: 70 },
];

export type Product = { id: number; name: string; producer: string; km: number; price: number; old?: number; unit: string; img: string; urgent?: string; verified: boolean };
export const products: Product[] = [
  { id: 1, name: "Macaxeira (lote 10 kg)", producer: "Sítio São José", km: 3.2, price: 18, old: 30, unit: "lote", img: produce, urgent: "Colhida hoje", verified: true },
  { id: 2, name: "Manga Espada (caixa 8 kg)", producer: "Sítio Boa Esperança", km: 5.1, price: 22, old: 40, unit: "caixa", img: produce, urgent: "Vence em 2 dias", verified: true },
  { id: 3, name: "Queijo Coalho artesanal 1 kg", producer: "Fazenda Riacho Doce", km: 7.4, price: 32, old: 42, unit: "kg", img: dairy, urgent: "Vence em 3 dias", verified: true },
  { id: 4, name: "Milho verde (mão c/ 50)", producer: "Sítio São José", km: 3.2, price: 35, unit: "mão", img: produce, verified: true },
  { id: 5, name: "Leite fresco 1 L", producer: "Fazenda Riacho Doce", km: 7.4, price: 5.5, unit: "litro", img: dairy, verified: true },
  { id: 6, name: "Banana prata (penca)", producer: "Sítio Pé de Serra", km: 9.8, price: 8, unit: "penca", img: produce, verified: false },
];

export const jobs = [
  { id: 1, kind: "Colheita", title: "Colheita de milho — 4 diaristas", who: "Sítio São José", where: "Zona Norte, 3 km", pay: "R$ 90/dia", when: "Seg a Qua" },
  { id: 2, kind: "Frete", title: "Frete de 2 t de macaxeira até a feira", who: "Seu Antônio", where: "Para o Centro", pay: "R$ 250", when: "Sábado, 5h" },
  { id: 3, kind: "Manutenção", title: "Conserto de cerca (200 m)", who: "Fazenda Riacho Doce", where: "Zona Leste, 7 km", pay: "R$ 600 empreitada", when: "Esta semana" },
  { id: 4, kind: "Colheita", title: "Apanha de manga — 2 pessoas", who: "Sítio Boa Esperança", where: "Zona Oeste, 5 km", pay: "R$ 85/dia", when: "Sex e Sáb" },
  { id: 5, kind: "Ordenha", title: "Ajudante de ordenha (manhã)", who: "Fazenda Riacho Doce", where: "Zona Leste, 7 km", pay: "R$ 1.400/mês", when: "Fixo" },
];

export const regions = [
  { name: "Zona Norte", toneladas: 182 },
  { name: "Zona Sul", toneladas: 124 },
  { name: "Zona Leste", toneladas: 210 },
  { name: "Zona Oeste", toneladas: 96 },
  { name: "Serra", toneladas: 143 },
];

export const roads = [
  { name: "Estrada do Sítio São José", region: "Zona Norte", issue: "Atoleiro / barro", reports: 27, level: "Crítico" },
  { name: "Vicinal PE-08 km 4", region: "Zona Leste", issue: "Buracos", reports: 19, level: "Crítico" },
  { name: "Ponte do Riacho", region: "Zona Leste", issue: "Estrutura danificada", reports: 14, level: "Alto" },
  { name: "Estrada da Serra", region: "Serra", issue: "Erosão lateral", reports: 9, level: "Médio" },
  { name: "Ramal Boa Esperança", region: "Zona Oeste", issue: "Mato alto", reports: 4, level: "Baixo" },
];

export const SERVICE_FEE = 0.05;
