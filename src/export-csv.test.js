import { getHeaderCsv } from "./export-csv.js";

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
