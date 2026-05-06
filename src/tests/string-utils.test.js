import { reverse } from "../string-utils.js";

test('reverse "abc" returns "cba"', () => {
  expect(reverse("abc")).toBe("cba");
});
test('reverse " returns "', () => {
  expect(reverse('"')).toBe('"');
});
test('reverse "null" returns an error', () => {
  expect(() => reverse(null)).toThrow("Une chaîne de caractère est attendue");
});
