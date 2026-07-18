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

  assert.match(privacy, /Google Mobile Ads SDK/);
  assert.match(privacy, /device identifiers/i);
  assert.match(privacy, /非パーソナライズ広告/);
  assert.match(support, /広告を取得できなくても問題演習は続けられます/);
  for (const file of ["legal.css", "privacy.html", "support.html"]) {
    assert.match(prepare, new RegExp(`"${file.replace(".", "\\.")}"`));
    assert.match(serviceWorker, new RegExp(`"\\./${file.replace(".", "\\.")}"`));
  }
  assert.match(prepare, /resolve\(root, "assets"\)/);
  assert.match(serviceWorker, /assets\/washi-paper-v1\.jpg/);
});

test("the iOS project uses test AdMob identifiers and documents the production replacement gate", async () => {
  const [plist, preparation, packageJson, adConfig, app, styles] = await Promise.all([
    read("ios/App/App/Info.plist"),
    read("APP_STORE_PREPARATION.md"),
    read("package.json"),
    read("ad-config.mjs"),
    read("app.mjs"),
    read("styles.css"),
  ]);
  assert.match(plist, /ca-app-pub-3940256099942544~1458002511/);
  assert.match(plist, /cstr6suwn9\.skadnetwork/);
  assert.match(adConfig, /ca-app-pub-3940256099942544\/2435281174/);
  assert.match(adConfig, /bannerAdSize:\s*"ADAPTIVE_BANNER"/);
  assert.match(adConfig, /bannerPosition:\s*"TOP_CENTER"/);
  assert.match(app, /--native-banner-offset/);
  assert.match(styles, /var\(--native-banner-offset\)/);
  assert.match(styles, /html\[data-theme="washi"\] body::before/);
  assert.match(styles, /repeating-linear-gradient\(103deg/);
  assert.match(styles, /html\[data-theme="washi"\] \.feedback-tools/);
  assert.match(styles, /--display: "Iowan Old Style"/);
  assert.match(styles, /--accent: #b7492f/);
  assert.match(styles, /--washi-fibers: url\("assets\/washi-paper-v1\.jpg"\)/);
  assert.match(styles, /\.piece, \.option-piece, \.movement-piece, \.promotion-guide-heading > span, \.modal-mark/);
  assert.match(styles, /#fffdf3/);
  assert.match(preparation, /そのまま公開しない/);
  assert.match(packageJson, /@capacitor-community\/admob/);
});

test("settings expose localized privacy and support links", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.mjs")]);
  assert.match(html, /data-i18n="privacyPolicy"/);
  assert.match(html, /data-i18n="support"/);
  assert.match(html, /id="privacy-options-button"/);
  assert.equal((app.match(/privacyPolicy:/g) || []).length, 4);
  assert.equal((app.match(/appSupport:/g) || []).length, 4);
  assert.equal((app.match(/advertisingNote:/g) || []).length, 4);
});
