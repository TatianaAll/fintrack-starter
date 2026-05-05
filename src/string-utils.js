export function reverse(str) {
  if (typeof str !== "string" || str === null) {
    throw new Error("Une chaîne de caractère est attendue");
  }
  return str.split("").reverse().join("");
}
