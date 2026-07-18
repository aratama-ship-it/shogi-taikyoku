import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [html, app, styles] = await Promise.all([
  read("index.html"),
  read("app.mjs"),
  read("styles.css"),
]);

test("piece guide uses visual movement diagrams for all pieces and promoted forms", () => {
  assert.match(html, /id="piece-guide"/);
  assert.match(html, /id="promotion-guide"/);
  assert.match(html, /class="movement-legend"/);
  assert.match(app, /const MOVEMENT_GUIDES = Object\.freeze/);
  assert.match(app, /DRAGON:/);
  assert.match(app, /HORSE:/);
  assert.match(app, /function createMovementDiagram/);
  assert.match(styles, /\.movement-diagram/);
  assert.match(styles, /\.movement-ray::after/);
  assert.match(styles, /\.movement-target\.jump/);
});

test("tsume rules are reachable from both home and settings", () => {
  assert.match(html, /id="home-rules-button"/);
  assert.match(html, /id="settings-rules-button"/);
  assert.match(html, /id="rules-layer"/);
  assert.match(app, /#home-rules-button"\)\.addEventListener/);
  assert.match(app, /#settings-rules-button"\)\.addEventListener/);
});

test("rules explain the core loop, move counting, and app convention in four languages", () => {
  assert.match(html, /class="rules-flow"/);
  assert.match(html, /class="rules-count"/);
  assert.match(html, /data-i18n="useAllHandPieces"/);
  assert.equal((app.match(/rulesLead:/g) || []).length, 4);
  assert.equal((app.match(/countingMoves:/g) || []).length, 4);
  assert.equal((app.match(/officialTsumeRules:/g) || []).length, 4);
  assert.match(html, /https:\/\/www\.shogi\.or\.jp\/tsume_shogi\//);
});
