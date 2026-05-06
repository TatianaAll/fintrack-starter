// 1. Une fonction qui prend un tableau de transactions et retourne une chaîne CSV avec une ligne d’en-tête.
// exemple d'une transaction (depuis seed.js)
// { id: 1,  date: todayMinus(28), label: 'Salaire', amount: 2400, type: 'credit', currency: 'EUR', category: 'revenu' },
export function getHeaderCsv(arrayTransaction) {
  const headersCsv = Object.keys(arrayTransaction);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  return headersCsv;
}

// 2. Une fonction qui prend le même tableau et qui ressort les transaction en une ligne csv
export function transformTransactionInCsv(arrayTransaction) {
  return arrayTransaction.map((transaction) => {
    const { date, label, amount, category } = transaction;
    return `"${date}","${label}","${amount}","${category}"`;
  });
}
