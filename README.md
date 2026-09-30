# Compliments · Responsible Digital

Responsible digital (GreenIT) tips for the [MagicMirror²](https://magicmirror.builders/) default **Compliments** module, in English and French.

Instead of generic compliments, your mirror reminds you of simple habits: switching devices off, keeping hardware longer, writing lighter code, sending fewer emails.

| File | Language | Compliments |
|---|---|---|
| [`compliments.json`](compliments.json) | English | 41 |
| [`compliments.fr.json`](compliments.fr.json) | Français | 41 |

## Usage

Point the module's `remoteFile` option to the file of your choice in `config/config.js`:

```js
{
  module: "compliments",
  position: "lower_third",
  config: {
    remoteFile: "https://raw.githubusercontent.com/olivierleteneur/products-MagicMirror-Modules-Compliments_ResponsibleDigital/main/compliments.json"
  }
},
```

To work offline, copy the file into the module's folder (`defaultmodules/compliments/` in recent MagicMirror² versions, `modules/default/compliments/` in older ones) and set `remoteFile: "compliments.json"`.

Sections follow the module: `anytime` is always shown, plus `morning`, `afternoon` or `evening` depending on the time of day.

## Quality checks

A small test suite (`node:test`, no dependencies) checks both files on every push:

- only the sections the module knows, none empty;
- no duplicate, even between `anytime` and another section (the module would show it twice as often);
- lines of 32 characters at most, with no stray spaces around line breaks, so they fit the mirror;
- the English and French files keep the same structure.

```bash
npm test
```

## Français

Des conseils de sobriété numérique pour le module **Compliments** de MagicMirror². Utilisez `compliments.fr.json` dans l'option `remoteFile` (voir l'exemple ci-dessus).

Contributions welcome: add a tip in both files, then run `npm test`.

Code (`lib/`, `test/`, workflow) under the MIT License, see [LICENSE](LICENSE). Compliments (`compliments*.json`) dedicated to the public domain under CC0 1.0, see [LICENSE-CONTENT](LICENSE-CONTENT).
