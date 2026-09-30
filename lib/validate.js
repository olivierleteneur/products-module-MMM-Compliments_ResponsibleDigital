// Checks a compliments file against what the MagicMirror² Compliments module expects.
// The module always adds `anytime` to the current time-of-day section, so a compliment
// present in both would be shown twice as often: duplicates are checked file-wide.

export const SECTIONS = ["anytime", "morning", "afternoon", "evening"];
export const MAX_LINE_LENGTH = 32;

export function normalize(text) {
  return text.toLowerCase().split(/\s+/).filter(Boolean).join(" ");
}

function checkCompliment(where, text, errors) {
  if (typeof text !== "string") return errors.push(`${where}: must be a string`);
  if (text.trim() === "") return errors.push(`${where}: empty compliment`);
  for (const line of text.split("\n")) {
    if (line === "") errors.push(`${where}: empty line`);
    else if (line !== line.trim()) errors.push(`${where}: spaces around a line break or at an end`);
    if (line.length > MAX_LINE_LENGTH) {
      errors.push(`${where}: line too long (${line.length} > ${MAX_LINE_LENGTH}): "${line}"`);
    }
  }
}

export function validateCompliments(data) {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return ["root: must be an object with sections"];
  }
  const errors = [];
  if (!("anytime" in data)) errors.push('missing section "anytime"');
  const seen = new Map();
  for (const [section, list] of Object.entries(data)) {
    if (!SECTIONS.includes(section)) {
      errors.push(`unknown section "${section}" (expected ${SECTIONS.join(", ")})`);
      continue;
    }
    if (!Array.isArray(list)) {
      errors.push(`${section}: must be an array`);
      continue;
    }
    if (list.length === 0) errors.push(`${section}: empty section`);
    list.forEach((text, i) => {
      const where = `${section}[${i}]`;
      checkCompliment(where, text, errors);
      if (typeof text !== "string") return;
      const key = normalize(text);
      if (seen.has(key)) errors.push(`duplicate: ${where} repeats ${seen.get(key)}`);
      else seen.set(key, where);
    });
  }
  return errors;
}

export function compareSections(a, b) {
  const errors = [];
  for (const section of SECTIONS) {
    const countA = a[section]?.length ?? 0;
    const countB = b[section]?.length ?? 0;
    if (countA !== countB) errors.push(`${section}: ${countA} vs ${countB} compliments`);
  }
  return errors;
}
