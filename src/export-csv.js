// 1. Une fonction qui prend un tableau de transactions et retourne une chaîne CSV avec une ligne d’en-tête.
// exemple d'une transaction (depuis seed.js)
// { id: 1,  date: todayMinus(28), label: 'Salaire', amount: 2400, type: 'credit', currency: 'EUR', category: 'revenu' },
export function getHeaderCsv(arrayTransaction) {
  const headersCsv = Object.getOwnPropertyNames(arrayTransaction);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
  return headersCsv;
}

const arrayTransaction = {
  id: 1,
  date: "xx/xx/xx",
  label: "Salaire",
  amount: 2400,
  type: "credit",
  currency: "EUR",
  category: "revenu",
};
console.log(getHeaderCsv(arrayTransaction));
