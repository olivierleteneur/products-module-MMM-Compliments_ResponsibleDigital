import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateCompliments, compareSections } from "../lib/validate.js";

const load = (file) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url), "utf8"));

for (const file of ["compliments.json", "compliments.fr.json"]) {
  test(`${file} respecte le format du module Compliments`, () => {
    assert.deepEqual(validateCompliments(load(file)), []);
  });
}

test("les versions anglaise et française ont la même structure", () => {
  assert.deepEqual(compareSections(load("compliments.json"), load("compliments.fr.json")), []);
});
