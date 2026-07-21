import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { PUZZLES } from "../puzzles.mjs";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [app, puzzles, puzzleTranslations, html, privacy, support, legal] = await Promise.all([
  read("app.mjs"),
  read("puzzles.mjs"),
  read("puzzle-i18n.mjs"),
  read("index.html"),
  read("privacy.html"),
  read("support.html"),
  read("legal.mjs"),
]);
const localizationSource = `${app}\n${puzzles}\n${puzzleTranslations}`;

test("non-Japanese move counts use unambiguous tsume terminology", () => {
  assert.doesNotMatch(localizationSource, /\bMate in [13579]\b/);
  assert.doesNotMatch(localizationSource, /\bMat en [13579]\b/);
  assert.doesNotMatch(localizationSource, /\bMate en [13579]\b/);
  assert.match(app, /mateInN: "\{n\}-ply tsume"/);
  assert.match(app, /mateInN: "Tsume en \{n\} demi-coups"/);
  assert.match(app, /mateInN: "Tsume de \{n\} medias jugadas"/);
  assert.match(app, /compactMateMany: "\{n\} plies"/);
  assert.match(app, /compactMateMany: "\{n\} demi-coups"/);
  assert.match(app, /compactMateMany: "\{n\} turnos"/);

  for (const puzzle of PUZZLES.filter(({ plies }) => plies > 1)) {
    assert.ok(puzzle.prompt.en.startsWith(`${puzzle.plies}-ply tsume`), puzzle.id);
    assert.ok(puzzle.prompt.fr.startsWith(`Tsume en ${puzzle.plies} demi-coups`), puzzle.id);
    assert.ok(puzzle.prompt.es.startsWith(`Tsume de ${puzzle.plies} medias jugadas`), puzzle.id);
  }
});

test("move-count explanations connect tsume plies to chess mate counts", () => {
  assert.match(html, /id="home-counting-button"/);
  assert.match(html, /class="rules-chess-note"/);
  assert.match(app, /#home-counting-button"\)\.addEventListener/);
  assert.equal((app.match(/homeCountingTitle:/g) || []).length, 4);
  assert.equal((app.match(/chessComparisonTitle:/g) || []).length, 4);
  assert.match(app, /A 3-ply tsume is the same length as chess “mate in 2”/);
  assert.match(app, /Un tsume en 3 demi-coups a la même longueur qu'un « mat en 2 »/);
  assert.match(app, /Un tsume de 3 medias jugadas dura lo mismo que un «mate en 2»/);
});

test("calculation language replaces literal translations of Japanese reading", () => {
  assert.match(app, /homeKicker: "CALCULATION PRACTICE"/);
  assert.match(app, /homeKicker: "EXERCICE DE CALCUL"/);
  assert.match(app, /homeKicker: "PRÁCTICA DE CÁLCULO"/);
  assert.doesNotMatch(app, /READING PRACTICE|EXERCICE DE LECTURE|PRÁCTICA DE LECTURA/);
  assert.doesNotMatch(localizationSource, /Suelta|suelta|Parachutez|parachutez|translation registry/);
  assert.doesNotMatch(puzzleTranslations, /General de General|Général d'oro|dondel|de le Général|\bde el General|Général d'ordre/);
  assert.doesNotMatch(puzzles, /head-gold|read to the end/);
});

test("piece names and western move notation are consistent", () => {
  assert.match(app, /en: "Gold General", fr: "Général d'or", es: "General de oro"/);
  assert.match(app, /en: "Silver General", fr: "Général d'argent", es: "General de plata"/);
  assert.match(app, /entry\.kind === "drop" \? "\*"/);
  assert.match(app, /return `\$\{mark\}\$\{info\.latin\}\$\{suffix\}\$\{destination\}`/);
});

test("visible and assistive interface labels follow the selected language", () => {
  for (const key of ["close", "closeSettings", "closePuzzleList", "closePieceGuide", "closeRules", "boardRegion", "howToPlay"]) {
    assert.equal((app.match(new RegExp(`${key}:`, "g")) || []).length, 4, key);
  }
  assert.match(html, /id="attacker-hand" data-i18n-aria="yourPieces"/);
  assert.match(html, /class="play-area" data-i18n-aria="boardRegion"/);
  assert.equal((html.match(/data-i18n-aria="close"/g) || []).length, 4);
});

test("privacy and support pages follow the app language in all four languages", () => {
  for (const page of [privacy, support]) {
    for (const language of ["ja", "en", "fr", "es"]) {
      assert.match(page, new RegExp(`data-legal-lang="${language}"`));
    }
    assert.match(page, /src="legal\.mjs"/);
  }
  assert.match(legal, /tsume-shogi-preferences-v1/);
  assert.match(legal, /applyLegalLanguage\(preferredLanguage\(\)\)/);
});

test("every puzzle has complete copy in all supported languages", () => {
  for (const puzzle of PUZZLES) {
    for (const field of ["title", "prompt", "success"]) {
      for (const language of ["ja", "en", "fr", "es"]) {
        assert.equal(typeof puzzle[field][language], "string", `${puzzle.id}.${field}.${language}`);
        assert.ok(puzzle[field][language].trim(), `${puzzle.id}.${field}.${language}`);
      }
    }
    const hints = puzzle.hints || (puzzle.hint ? [puzzle.hint] : []);
    for (const [index, hint] of hints.entries()) {
      for (const language of ["ja", "en", "fr", "es"]) {
        assert.equal(typeof hint[language], "string", `${puzzle.id}.hints[${index}].${language}`);
        assert.ok(hint[language].trim(), `${puzzle.id}.hints[${index}].${language}`);
      }
    }
  }
});
