import {
  getCsvHeaders,
  transactionsToCsvRows,
  filterTransactionsCurrentMonth,
  escapeCsvValue,
  buildCsvContent,
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
  expect(getCsvHeaders(arrayTransaction)).toEqual([
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
  expect(transactionsToCsvRows(arrayTransaction)).toEqual([
    `"xx/xx/xx","Salaire","2400","revenu"`,
  ]);
});

test("Retourner uniquement les transactions du mois en cours", () => {
  const currentMonth = new Date().getMonth() + 1;
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
      date: "01/04/2026",
      label: "Salaire",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 4,
      date: `05/${currentMonth}/2026`,
      label: "virement",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
  ];
  expect(filterTransactionsCurrentMonth(arrayTransaction)).toEqual([
    {
      id: 4,
      date: `05/${currentMonth}/2026`,
      label: "virement",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
  ]);
});

test("échappe un champ simple", () => {
  expect(escapeCsvValue("Salaire")).toBe('"Salaire"');
});

test("échappe une virgule", () => {
  expect(escapeCsvValue("Salaire, prime")).toBe('"Salaire, prime"');
});

test("échappe les guillemets", () => {
  expect(escapeCsvValue('Prime "exceptionnelle"')).toBe(
    '"Prime ""exceptionnelle"""',
  );
});

test("échappe les retours ligne", () => {
  expect(escapeCsvValue("Ligne\nNouvelle")).toBe('"Ligne\nNouvelle"');
});

test("buildCsvContent retourne seulement les headers CSV pour un tableau vide", () => {
  expect(buildCsvContent([])).toBe('"date","label","amount","category"');
});

test("buildCsvContent retourne seulement les headers CSV si la valeur n'est pas un tableau", () => {
  expect(buildCsvContent(null)).toBe('"date","label","amount","category"');
});
