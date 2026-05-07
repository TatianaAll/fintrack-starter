import { normalizeOptions } from "../transactions-legacy";

describe("normalizeOptions", () => {
  it("retourne les valeurs par défaut si opts est invalide", () => {
    const result = normalizeOptions([]);
    expect(result.currency).toBe("EUR");
    expect(result.threshold).toBe(1000);
  });

  it("ignore month = 0", () => {
    const result = normalizeOptions({ month: 0 });
    expect(result.month).toBe(new Date().getMonth());
  });
});
