import { processTransactions } from "../transactions-legacy";

// ----- TEST POUR REFACTO DE LA FONCTION ------
/* https://mariocervera.com/characterization-testing-adding-tests-to-legacy-code 
An algorithm for characterization testing
Michael Feathers suggests the following algorithm to write characterization tests:

  1. Put a piece of code in a test harness; that is, call it from a test.
  2. Write an assertion that you know will fail.
  3. Let the failure tell you what the behavior is.
  4. Change the test so that it expects the behavior that the code produces.
  5. Repeat.

*/

describe("processTransactions", () => {
  it("calcule correctement le total pour un crédit et un débit", () => {
    const txs = [
      {
        id: 1,
        date: "2026-05-01",
        type: "credit",
        amount: 100,
        currency: "EUR",
        label: "Salaire",
      },
      {
        id: 2,
        date: "2026-05-07",
        type: "debit",
        amount: 40,
        currency: "EUR",
        label: "Course",
      },
    ];
    // opts est un objet normalement, si je le met en tableau ?
    const result = processTransactions(txs, [5, 2025]);

    expect(result.total).toBe(60);
    expect(result.nbCredit).toBe(1);
    expect(result.nbDebit).toBe(1);
  }); // Test passe même si opts est un tableau car le remplace par les opts de base
});
