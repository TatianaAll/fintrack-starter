import {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  formatAmount,
  simpleInterest,
} from "./calculator.js";

// -------- TESTE DES FONCTIONS DE CALCUL SIMPLE ----------
describe("add", () => {
  it("retourne 5 quand on additionne 2 et 3", () => {
    expect(add(2, 3)).toBe(5);
  });
});

describe("subtract", () => {
  it("retourne 5 quand on soustrait 8 à 3", () => {
    expect(subtract(8, 3)).toBe(5);
  });
  // teste des chiffre négatif
  it("retourne -3 quand on soustrait 1 à 4", () => {
    expect(subtract(1, 4)).toBe(-3);
  });
});

describe("multiply", () => {
  it("retourne 16 quand on multiplie 8 par 2", () => {
    expect(multiply(8, 2)).toBe(16);
  });
  it("0*10 = 0", () => {
    expect(multiply(0, 10)).toBe(0);
  });
});

describe("divide", () => {
  it("retourne 1 quand on divise 8 par 8", () => {
    expect(divide(8, 8)).toBe(1);
  });
  it("lève une erreur quand on divise par zéro", () => {
    expect(() => divide(8, 0)).toThrow("Division par zéro impossible");
  });
});

describe("modulo", () => {
  it("retourne 0 quand on divise 4 par 2", () => {
    expect(modulo(4, 2)).toBe(0);
  });
});

// --------- TESTE DES FONCTIONS DE CALCUL COMPLEXE ---------
describe("formatAmount", () => {
  it("Formate un montant avec 2 décimale et la monnaie", () => {
    expect(formatAmount(4, "USD")).toBe("4.00 $");
  });
  it("Formate un montant avec 2 décimale et la monnaie", () => {
    expect(formatAmount(1000, "GBP")).toBe("1000.00 £");
  });
  it("Formate un montant avec 2 décimale et la monnaie", () => {
    expect(formatAmount(0, "EUR")).toBe("0.00 €");
  });
});

describe("simpleInterest", () => {
  it("Calcul un intérêt simple", () => {
    expect(simpleInterest(100, 1, 1)).toBe(1);
  });
  it("Calcul un intérêt simple avec un 0", () => {
    expect(simpleInterest(100, 1, 0)).toBe(0);
  });
  it("calcule l'intérêt simple correctement pour 1000€ à 5% sur 2 ans", () => {
    expect(simpleInterest(1000, 5, 2)).toBe(100);
  });
});
