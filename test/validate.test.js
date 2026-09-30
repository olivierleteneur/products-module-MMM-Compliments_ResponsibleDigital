import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCompliments, compareSections, normalize } from "../lib/validate.js";

const valid = () => ({ anytime: ["I use dark mode"], morning: ["I switch off\nthe lights"] });

test("un fichier valide ne produit aucune erreur", () => {
  assert.deepEqual(validateCompliments(valid()), []);
});

test("normalize ignore la casse, les retours à la ligne et les espaces", () => {
  assert.equal(normalize("I switch  off\nthe LIGHTS "), "i switch off the lights");
});

test("rejette ce qui n'est pas un objet", () => {
  for (const input of [null, [], "text", 42]) {
    assert.match(validateCompliments(input).join(), /object/);
  }
});

test("exige la section anytime", () => {
  assert.match(validateCompliments({ morning: ["x"] }).join(), /anytime/);
});

test("rejette une section inconnue", () => {
  assert.match(validateCompliments({ ...valid(), night: ["x"] }).join(), /unknown section "night"/);
});

test("rejette une section vide ou qui n'est pas un tableau", () => {
  assert.match(validateCompliments({ anytime: [] }).join(), /anytime.*empty/);
  assert.match(validateCompliments({ anytime: "x" }).join(), /anytime.*array/);
});

test("rejette un compliment vide ou qui n'est pas une chaîne", () => {
  assert.match(validateCompliments({ anytime: [""] }).join(), /anytime\[0\].*empty/);
  assert.match(validateCompliments({ anytime: [42] }).join(), /anytime\[0\].*string/);
});

test("rejette les espaces autour des retours à la ligne", () => {
  assert.match(validateCompliments({ anytime: ["I use \n dark mode"] }).join(), /anytime\[0\].*spaces/);
});

test("rejette une ligne vide", () => {
  assert.match(validateCompliments({ anytime: ["I use\n\ndark mode"] }).join(), /anytime\[0\].*empty line/);
});

test("rejette une ligne trop longue pour l'écran", () => {
  const errors = validateCompliments({ anytime: ["x".repeat(33)] });
  assert.match(errors.join(), /anytime\[0\].*33 > 32/);
  assert.deepEqual(validateCompliments({ anytime: ["x".repeat(32)] }), []);
});

test("rejette un doublon, y compris entre anytime et une autre section", () => {
  // anytime est toujours ajouté aux autres sections par le module : un doublon double la fréquence
  const errors = validateCompliments({ anytime: ["I use dark mode"], evening: ["I use\ndark mode"] });
  assert.match(errors.join(), /duplicate.*evening\[0\].*anytime\[0\]/);
});

test("compareSections accepte deux langues de même structure", () => {
  assert.deepEqual(compareSections(valid(), valid()), []);
});

test("compareSections signale une section ou un nombre de compliments différent", () => {
  const fr = { anytime: ["a", "b"], evening: ["c"] };
  const errors = compareSections(valid(), fr).join("\n");
  assert.match(errors, /anytime: 1 vs 2/);
  assert.match(errors, /morning: 1 vs 0/);
  assert.match(errors, /evening: 0 vs 1/);
});
