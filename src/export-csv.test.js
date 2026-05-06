import { getHeaderCsv } from "./export-csv.js";

test('reverse "abc" returns "cba"', () => {
  expect(getHeaderCsv("abc")).toBe("cba");
});
test('reverse " returns "', () => {
  expect(getHeaderCsv('"')).toBe('"');
});
test('reverse "null" returns an error', () => {
  expect(() => getHeaderCsv(null)).toThrow(
    "Une chaîne de caractère est attendue",
  );
});
