import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Capacitor uses the generated offline web bundle", async () => {
  const config = await read("capacitor.config.ts");
  assert.match(config, /appId:\s*"com\.jugglerarata\.tsumeshogi"/);
  assert.match(config, /webDir:\s*"public"/);
});

test("privacy and support documents ship in the public bundle", async () => {
  const [privacy, support, prepare, serviceWorker] = await Promise.all([
    read("privacy.html"),
    read("support.html"),
    read("scripts/prepare-public.mjs"),
    read("sw.js"),
  ]);

  assert.match(privacy, /個人データを収集・送信しません/);
  assert.match(privacy, /does not collect or transmit personal data/i);
  assert.match(support, /通常のプレイにインターネット接続は不要/);
  for (const file of ["legal.css", "privacy.html", "support.html"]) {
    assert.match(prepare, new RegExp(`"${file.replace(".", "\\.")}"`));
    assert.match(serviceWorker, new RegExp(`"\\./${file.replace(".", "\\.")}"`));
  }
});

test("settings expose localized privacy and support links", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.mjs")]);
  assert.match(html, /data-i18n="privacyPolicy"/);
  assert.match(html, /data-i18n="support"/);
  assert.equal((app.match(/privacyPolicy:/g) || []).length, 4);
  assert.equal((app.match(/appSupport:/g) || []).length, 4);
});
