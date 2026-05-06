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

// 3. Les transactions hors du mois en cours sont filtrées.
export function transactionOnlyInCurrentMonth(arrayTransaction) {
  const currentMonth = new Date().getMonth() + 1;
  return arrayTransaction.filter((transaction) => {
    const transactionMonth = Number(transaction.date.split("/")[1]);
    return transactionMonth === currentMonth;
  });
}

// 4. Les caractères spéciaux (virgules, guillemets) sont échappés selon la norme RFC 4180.
// https://www.rfc-editor.org/rfc/rfc4180.html
// Each record is located on a separate line, delimited by a line break (CRLF).
// Fields containing line breaks (CRLF), double quotes, and commas should be enclosed in double-quotes.
export function encapsulateSpecialChars(value) {
  // si on a un espace vide on ne le saute pas on le met vide
  if (value === null || value === undefined) {
    return '""';
  }

  const stringValue = String(value);
  const hasSpecialChar =
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r");

  if (!hasSpecialChar) {
    return `"${stringValue}"`;
  }

  const escapedValue = stringValue.replace(/"/g, '""');
  return `"${escapedValue}"`;
}

// 5. Un tableau vide retourne juste l’en-tête CSV.
export function emptyArray(arrayTransaction) {
  const headers = ["date", "label", "amount", "category"];
  const headerRow = headers.map(encapsulateSpecialChars).join(",");

  if (!Array.isArray(arrayTransaction) || arrayTransaction.length === 0) {
    return headerRow;
  }

  const rows = transformTransactionInCsv(arrayTransaction);
  return [headerRow, ...rows].join("\r\n");
}

export function downloadCSV(arrayTransaction, fileName = "transactions.csv") {
  const csvContent = emptyArray(arrayTransaction);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return csvContent;
}

// const arrayTransaction = [
//   {
//     id: 1,
//     date: "05/05/2026",
//     label: "Salaire",
//     amount: 2400,
//     type: "credit",
//     currency: "EUR",
//     category: "revenu",
//   },
//   {
//     id: 2,
//     date: "05/02/2026",
//     label: "Salaire",
//     amount: 1900,
//     type: "impot",
//     currency: "EUR",
//     category: "revenu",
//   },
// ];
// console.log(transactionOnlyInCurrentMonth(arrayTransaction));
