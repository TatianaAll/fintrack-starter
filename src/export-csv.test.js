import {
  getHeaderCsv,
  transformTransactionInCsv,
  transactionOnlyInCurrentMonth,
} from "./export-csv.js";

test("Retourner les bons nom de colonnes", () => {
  const arrayTransaction = {
    id: 1,
    date: "xx/xx/xx",
    label: "Salaire",
    amount: 2400,
    type: "credit",
    currency: "EUR",
    category: "revenu",
  };
  expect(getHeaderCsv(arrayTransaction)).toEqual([
    "id",
    "date",
    "label",
    "amount",
    "type",
    "currency",
    "category",
  ]);
});

test("Retourner les bonnes informations de la ligne", () => {
  const arrayTransaction = [
    {
      id: 1,
      date: "xx/xx/xx",
      label: "Salaire",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
  ];
  expect(transformTransactionInCsv(arrayTransaction)).toEqual([
    `"xx/xx/xx","Salaire","2400","revenu"`,
  ]);
});

test("Retourner uniquement les transactions du mois en cours", () => {
  const arrayTransaction = [
    {
      id: 1,
      date: "21/01/2026",
      label: "Salaire",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 2,
      date: "21/04/2026",
      label: "Salaire",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 3,
      date: "01/05/2026",
      label: "Salaire",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 4,
      date: "05/05/2026",
      label: "virement",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
  ];
  expect(transactionOnlyInCurrentMonth(arrayTransaction)).toEqual([
    {
      id: 3,
      date: "01/05/2026",
      label: "Salaire",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 4,
      date: "05/05/2026",
      label: "virement",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
  ]);
});
