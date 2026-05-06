import { jest } from "@jest/globals";
import {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  formatAmount,
  simpleInterest,
  generateTimestamp,
  compoundInterest,
  convertCurrency,
  computeBalance,
} from "../calculator.js";

// -------- TESTE DES FONCTIONS DE CALCUL SIMPLE ----------
describe("add", () => {
  it("retourne 5 quand on additionne 2 et 3", () => {
    expect(add(2, 3)).toBe(5);
  });
  it("Erreur si calcul avec une chaîne de caractère", () => {
    expect(() => add(5, "amandine")).toThrow(
      "Merci de ne mettre que des nombres, pas de string",
    );
  });
  it("additionne des nombres négatifs", () => {
    expect(add(-2, -3)).toBe(-5);
  });
  it("additionne avec zéro", () => {
    expect(add(0, 5)).toBe(5);
  });
  it("gère les grands nombres (perte de précision possible)", () => {
    expect(add(1e15, 1e15)).toBe(2e15);
  });
  it("retourne NaN avec NaN", () => {
    expect(add(NaN, 5)).toBeNaN();
  });
  it("retourne Infinity avec Infinity", () => {
    expect(add(Infinity, 5)).toBe(Infinity);
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
  it("soustrait des nombres négatifs", () => {
    expect(subtract(-5, -3)).toBe(-2);
  });
  it("soustrait zéro", () => {
    expect(subtract(10, 0)).toBe(10);
  });
  it("gère les grands nombres", () => {
    expect(subtract(1e15, 5e14)).toBe(5e14);
  });
  it("retourne NaN avec NaN", () => {
    expect(subtract(NaN, 5)).toBeNaN();
  });
  it("Erreur si calcul avec une chaîne de caractère", () => {
    expect(() => subtract(5, "amandine")).toThrow(
      "Merci de ne mettre que des nombres, pas de string",
    );
  });
});

describe("multiply", () => {
  it("retourne 16 quand on multiplie 8 par 2", () => {
    expect(multiply(8, 2)).toBe(16);
  });
  it("0*10 = 0", () => {
    expect(multiply(0, 10)).toBe(0);
  });
  it("multiplie des nombres négatifs", () => {
    expect(multiply(-2, 3)).toBe(-6);
  });
  it("gère les grands nombres", () => {
    expect(multiply(1e10, 1e5)).toBe(1e15);
  });
  it("retourne NaN avec NaN", () => {
    expect(multiply(NaN, 5)).toBeNaN();
  });
  it("Erreur si calcul avec une chaîne de caractère", () => {
    expect(() => multiply(5, "amandine")).toThrow(
      "Merci de ne mettre que des nombres, pas de string",
    );
  });
});

describe("divide", () => {
  it("retourne 1 quand on divise 8 par 8", () => {
    expect(divide(8, 8)).toBe(1);
  });
  it("lève une erreur quand on divise par zéro", () => {
    expect(() => divide(8, 0)).toThrow("Division par zéro impossible");
  });
  it("divise zéro", () => {
    expect(divide(0, 5)).toBe(0);
  });
  it("divise des nombres négatifs", () => {
    expect(divide(-8, 2)).toBe(-4);
  });
  it("retourne NaN avec NaN", () => {
    expect(divide(NaN, 5)).toBeNaN();
  });
  it("Erreur si calcul avec une chaîne de caractère", () => {
    expect(() => divide(5, "amandine")).toThrow(
      "Merci de ne mettre que des nombres, pas de string",
    );
  });
});

describe("modulo", () => {
  it("retourne 0 quand on divise 4 par 2", () => {
    expect(modulo(4, 2)).toBe(0);
  });
  it("retourne NaN pour modulo par zéro", () => {
    expect(modulo(5, 0)).toBeNaN();
  });
  it("gère les nombres négatifs", () => {
    expect(modulo(-7, 3)).toBe(-1); // Comportement JS : signe du dividende
  });
  it("retourne zéro pour modulo exact", () => {
    expect(modulo(10, 5)).toBe(0);
  });
  it("Erreur si calcul avec une chaîne de caractère", () => {
    expect(() => modulo(5, "amandine")).toThrow(
      "Merci de ne mettre que des nombres, pas de string",
    );
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
  it("gère NaN", () => {
    expect(formatAmount(NaN)).toBe("NaN €");
  });
  it("gère Infinity", () => {
    expect(formatAmount(Infinity)).toBe("Infinity €");
  });
  it("gère une currency inconnue", () => {
    expect(formatAmount(100, "XYZ")).toBe("100.00 XYZ");
  });
  it("gère un amount négatif", () => {
    expect(formatAmount(-50)).toBe("-50.00 €");
  });
});

// test de la fonction simple interest en mettant
describe("simpleInterest", () => {
  it("Calcul un intérêt simple", () => {
    expect(simpleInterest(100, 1, 1)).toBe(1);
  });
  it("retourne zéro si principal est zéro", () => {
    expect(simpleInterest(0, 5, 2)).toBe(0);
  });
  it("retourne zéro si rate est zéro", () => {
    expect(simpleInterest(1000, 0, 2)).toBe(0);
  });
  it("retourne zéro si years est zéro", () => {
    expect(simpleInterest(1000, 5, 0)).toBe(0);
  });
  it("gère un principal négatif (emprunt)", () => {
    expect(simpleInterest(-1000, 5, 2)).toBe(-100);
  });
  it("calcule l'intérêt simple correctement pour 1000€ à 5% sur 2 ans", () => {
    expect(simpleInterest(1000, 5, 2)).toBe(100);
  });
});

describe("generateTimestamp", () => {
  const realDateNow = Date.now;
  beforeAll(() => {
    Date.now = jest.fn(() => 1700000000000);
  });
  afterAll(() => {
    Date.now = realDateNow;
  });

  it("retourne le timestamp mocké", () => {
    const result = generateTimestamp();
    expect(Date.now).toHaveBeenCalled();
    expect(result).toBe(1700000000000);
  });
});

// ---------- AJOUT VIA IA -----------
describe("compoundInterest", () => {
  it("calcul les intérets pour des valeurs positives", () => {
    expect(compoundInterest(1000, 5, 2)).toBeCloseTo(102.5, 5);
  });
  it("retourne 0 quand l'année est à 0", () => {
    expect(compoundInterest(1000, 5, 0)).toBe(0);
  });
  it("retourne 0 si la rate est à 0", () => {
    expect(compoundInterest(1000, 0, 5)).toBe(0);
  });
  it("gère les rate négatives", () => {
    const result = compoundInterest(1000, -10, 1);
    expect(result).toBeCloseTo(-100, 5);
  });
});

describe("convertCurrency", () => {
  it("convertis un amount avec une rate positive", () => {
    expect(convertCurrency(100, 1.2)).toBe(120);
  });
  it("revois 0 quand amount = 0", () => {
    expect(convertCurrency(0, 1.5)).toBe(0);
  });
  it("Autorise les rate négative (latent bug)", () => {
    expect(convertCurrency(100, -1.2)).toBe(-120);
  });
});

describe("computeBalance", () => {
  it("computes balance with credits and debits", () => {
    const txs = [
      { amount: 100, type: "credit" },
      { amount: 40, type: "debit" },
      { amount: 10, type: "credit" },
    ];
    expect(computeBalance(txs)).toBe(70);
  });
  it("returns 0 for an empty transactions array", () => {
    expect(computeBalance([])).toBe(0);
  });
  it("treats any non-credit type as debit", () => {
    const txs = [{ amount: 50, type: "debit" }];
    expect(computeBalance(txs)).toBe(-50);
  });
  it("throws when transactions is null (latent bug)", () => {
    expect(() => computeBalance(null)).toThrow();
  });
});
