import { getHeaderCsv, transformTransactionInCsv } from "./export-csv.js";

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
