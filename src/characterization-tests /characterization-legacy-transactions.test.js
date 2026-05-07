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

Les tests de caractérisation servent à figer le comportement existant d’un code legacy afin de pouvoir le refactorer en toute sécurité, sans modifier son comportement observable.
*/

// Tests de caractérisation sur le format des opts qui est un paramètre attendu à l'appel de la fonction
describe("processTransactions", () => {
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
  const baseOpts = { month: 4, year: 2026 }; // mai 2026 (commence à 0 pour janvier)

  it("calcule correctement le total pour un crédit et un débit", () => {
    const result = processTransactions(txs, { month: 4, year: 2026 }); // il faut mettre 4 pour mai...
    expect(result.total).toBe(60);
    expect(result.nbCredit).toBe(1);
    expect(result.nbDebit).toBe(1);
  }); // Test passe même si opts est un tableau car le remplace par les opts de base
  it("utilise les options par défaut quand opts n'est pas un objet", () => {
    const result = processTransactions(txs, []);
    expect(result.total).toBe(60);
  });
  it("utilise les options par défaut quand opts est undefined", () => {
    const result = processTransactions(txs);
    expect(result.total).toBe(60);
  });
  it("utilise les options par défaut quand opts est null", () => {
    const result = processTransactions(txs, null);
    expect(result.total).toBe(60);
  });
  it("ignore opts.month = 0 et utilise le mois courant", () => {
    const result = processTransactions(txs, { month: 0, year: 2026 });
    expect(result.total).toBe(60);
  });

  // Test de caractérisation sur le traitement d'une transactions
  it("rejette une transaction avec un type invalide", () => {
    const txs = [{ id: 1, date: "2026-05-01", type: "foo", amount: 100 }];
    const result = processTransactions(txs, { month: 4, year: 2026 });
    expect(result.transactions.length).toBe(0);
    expect(result.errors.length).toBe(1); // type invalide donc erreur
  });
  it("rejette une transaction avec un montant undefined", () => {
    const txs = [{ id: 1, date: "2026-05-01", type: "debit" }];
    const result = processTransactions(txs, { month: 4, year: 2026 });
    expect(result.transactions.length).toBe(0);
    expect(result.errors.length).toBe(1); // pas de montant donc erreur
  });
  it("rejette une transaction avec un montant null", () => {
    const txs = [{ id: 1, date: "2026-05-01", type: "debit", amount: null }];
    const result = processTransactions(txs, { month: 4, year: 2026 });
    expect(result.transactions.length).toBe(0);
    expect(result.errors.length).toBe(1); // pas de montant donc erreur
  });

  // conversion monétaire
  it("convertit USD vers EUR avec un taux fixe", () => {
    const txs = [
      {
        id: 1,
        date: "2026-05-01",
        type: "credit",
        amount: 100,
        currency: "USD",
      },
    ];
    const result = processTransactions(txs, baseOpts);
    expect(result.transactions[0].amount).toBe(92); // taux en dur dans le code
  });

  it("utilise un taux de conversion égal à 1 pour une devise inconnue", () => {
    const txs = [
      {
        id: 1,
        date: "2026-05-01",
        type: "credit",
        amount: 100,
        currency: "JPY",
      },
    ];
    const result = processTransactions(txs, baseOpts);
    expect(result.transactions[0].amount).toBe(100); // taux à 1 en fallback
  });
});
