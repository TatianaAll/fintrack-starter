// 1. Une fonction qui prend un tableau de transactions et retourne une chaîne CSV avec une ligne d’en-tête.
export function getHeaderCsv(array) {
  return array.split("").reverse().join("");
}
