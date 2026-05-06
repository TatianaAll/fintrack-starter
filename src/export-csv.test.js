import {
  getCsvHeaders,
  transactionsToCsvRows,
  filterTransactionsCurrentMonth,
  escapeCsvValue,
  buildCsvContent,
} from "./export-csv.js";

test("Je donne un tableau de transaction, quand je récupère les en-têtes CSV, alors je dois obtenir les noms de colonnes corrects", () => {
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

test("Je donne UNE transaction, quand je transforme la ligne en CSV, alors je dois obtenir les valeurs échappées correctement", () => {
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

test("Je donne des transactions de différents mois, quand je filtre par mois courant, alors seules les transactions du mois courant sont retournées", () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
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
      date: `05/${currentMonth}/${currentYear}`,
      label: "virement",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 5,
      date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-05T08:42:12.321Z`,
      label: "Coffee shop",
      amount: 4.2,
      type: "debit",
      currency: "EUR",
      category: "autre",
    },
  ];
  expect(filterTransactionsCurrentMonth(arrayTransaction)).toEqual([
    {
      id: 4,
      date: `05/${currentMonth}/${currentYear}`,
      label: "virement",
      amount: 2400,
      type: "credit",
      currency: "EUR",
      category: "revenu",
    },
    {
      id: 5,
      date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-05T08:42:12.321Z`,
      label: "Coffee shop",
      amount: 4.2,
      type: "debit",
      currency: "EUR",
      category: "autre",
    },
  ]);
});

test("Étant donné une valeur simple, quand je l'échappe, alors elle est encadrée par des guillemets", () => {
  expect(escapeCsvValue("Salaire")).toBe('"Salaire"');
});

test("Étant donné une valeur contenant une virgule, quand je l'échappe, alors la valeur reste valide en CSV", () => {
  expect(escapeCsvValue("Salaire, prime")).toBe('"Salaire, prime"');
});

test("Étant donné une valeur contenant des guillemets, quand je l'échappe, alors les guillemets internes sont doublés", () => {
  expect(escapeCsvValue('Prime "exceptionnelle"')).toBe(
    '"Prime ""exceptionnelle"""',
  );
});

test("Étant donné une valeur contenant un saut de ligne, quand je l'échappe, alors le saut de ligne est conservé dans la valeur CSV", () => {
  expect(escapeCsvValue("Ligne\nNouvelle")).toBe('"Ligne\nNouvelle"');
});

test("Étant donné un tableau vide, quand je construis le contenu CSV, alors je ne reçois que la ligne d'en-tête", () => {
  expect(buildCsvContent([])).toBe('"date","label","amount","category"');
});

test("Étant donné une valeur non-tableau, quand je construis le contenu CSV, alors je ne reçois que la ligne d'en-tête", () => {
  expect(buildCsvContent(null)).toBe('"date","label","amount","category"');
});
