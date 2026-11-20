import test from "node:test";
import assert from "node:assert/strict";
import {
  getNextTheme,
  isValidTheme,
  resolveInitialTheme,
} from "./theme";

test("isValidTheme accepts only light and dark", () => {
  assert.equal(isValidTheme("light"), true);
  assert.equal(isValidTheme("dark"), true);
  assert.equal(isValidTheme("system"), false);
  assert.equal(isValidTheme(null), false);
});

test("resolveInitialTheme prioritizes stored preference over media query", () => {
  assert.equal(resolveInitialTheme("dark", false), "dark");
  assert.equal(resolveInitialTheme("light", true), "light");
  assert.equal(resolveInitialTheme(null, true), "dark");
  assert.equal(resolveInitialTheme(null, false), "light");
  assert.equal(resolveInitialTheme("invalid", true), "dark");
});

test("getNextTheme switches between light and dark", () => {
  assert.equal(getNextTheme("light"), "dark");
  assert.equal(getNextTheme("dark"), "light");
});
