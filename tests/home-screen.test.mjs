import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [html, app, styles, serviceWorker] = await Promise.all([
  read("index.html"),
  read("app.mjs"),
  read("styles.css"),
  read("sw.js"),
]);

test("the app opens on a dedicated home screen before the puzzle view", () => {
  const homePosition = html.indexOf('id="home-view"');
  const playPosition = html.indexOf('id="play-view"');
  assert.ok(homePosition >= 0);
  assert.ok(playPosition > homePosition);
  assert.match(html, /id="play-view" hidden/);
  assert.match(app, /let activeView = "home"/);
  assert.match(app, /#home-view"\)\.hidden = !onHome/);
});

test("home exposes continue, length, random, settings, and learning routes", () => {
  assert.match(html, /id="home-continue-button"/);
  assert.match(html, /id="home-random-button"/);
  assert.match(html, /id="home-button"/);
  assert.match(html, /id="settings-button"/);
  assert.match(html, /id="home-learn-button"/);
  assert.equal((html.match(/data-home-plies=/g) || []).length, 5);
  assert.match(app, /#home-continue-button"\)\.addEventListener\("click", showPlay\)/);
  assert.match(app, /#home-button"\)\.addEventListener\("click", showHome\)/);
  assert.match(app, /#home-length-options \[data-home-plies\]/);
});

test("home progress and copy support all four languages", () => {
  assert.match(html, /id="home-progress-track" role="progressbar"/);
  assert.match(app, /preferences\.completed/);
  assert.match(app, /home-progress-fill/);
  assert.equal((app.match(/homeTitle:/g) || []).length, 4);
  assert.equal((app.match(/continuePractice:/g) || []).length, 4);
  assert.equal((app.match(/chooseByLength:/g) || []).length, 4);
});

test("the craft-led home styling and refreshed offline cache ship together", () => {
  assert.match(styles, /\.home-hero-mark/);
  assert.match(styles, /\.home-length-rail/);
  assert.match(styles, /html\[data-theme="washi"\] :is\([\s\S]*\.home-hero/);
  assert.match(serviceWorker, /tsume-shogi-v30/);
  assert.match(serviceWorker, /refreshOnVisit/);
  assert.match(styles, /#settings-button > span[^}]*font-size: 20px/s);
  assert.match(html, /一手ずつ、<wbr>詰みが見える。/);
  assert.match(app, /homeTitle: "一手ずつ、\\u200B詰みが見える。"/);
  assert.match(styles, /\.home-hero h1[^}]*word-break: keep-all/s);
  assert.match(html, /短い詰みから、<wbr>少しずつ読む距離を伸ばします。/);
  assert.match(app, /chooseByLengthCopy: "短い詰みから、\\u200B少しずつ読む距離を伸ばします。"/);
  assert.match(styles, /\.home-section-heading p[^}]*word-break: keep-all/s);
});
