import test from "node:test";
import assert from "node:assert/strict";

import { createAdManager, validateAdConfig } from "../ad-manager.mjs";

test("ad configuration cannot mix demo IDs with production mode", () => {
  assert.throws(
    () => validateAdConfig({
      testMode: false,
      interstitialAdId: "ca-app-pub-3940256099942544/4411468910",
    }),
    /production AdMob interstitial/,
  );
  assert.throws(
    () => validateAdConfig({
      testMode: true,
      interstitialAdId: "ca-app-pub-1234567890123456/1234567890",
    }),
    /demo ad unit ID/,
  );
});

test("native AdMob preloads a non-personalized test ad and shows only after four solves", async (context) => {
  const calls = { initialize: [], prepare: [], show: 0 };
  const listeners = new Map();
  const plugin = {
    async initialize(options) { calls.initialize.push(options); },
    async addListener(event, listener) {
      listeners.set(event, listener);
      return { remove: async () => listeners.delete(event) };
    },
    async requestConsentInfo() {
      return { canRequestAds: true, privacyOptionsRequirementStatus: "REQUIRED" };
    },
    async prepareInterstitial(options) { calls.prepare.push(options); },
    async showInterstitial() { calls.show += 1; },
    async showPrivacyOptionsForm() {},
  };

  const originalCapacitor = globalThis.Capacitor;
  globalThis.Capacitor = {
    isNativePlatform: () => true,
    isPluginAvailable: (name) => name === "AdMob",
    Plugins: { AdMob: plugin },
  };
  context.after(() => {
    if (originalCapacitor === undefined) delete globalThis.Capacitor;
    else globalThis.Capacitor = originalCapacitor;
  });

  const preferences = {};
  let saved = 0;
  const manager = createAdManager({ preferences, savePreferences: () => { saved += 1; } });
  await manager.initialize();

  assert.deepEqual(calls.initialize, [{ maxAdContentRating: "General" }]);
  assert.equal(calls.prepare.length, 1);
  assert.deepEqual(calls.prepare[0], {
    adId: "ca-app-pub-3940256099942544/4411468910",
    npa: true,
  });
  assert.equal(manager.isPrivacyOptionsRequired(), true);

  for (let solved = 0; solved < 3; solved += 1) manager.recordSolve();
  assert.equal(manager.willShowOnNext(), false);
  manager.recordSolve();
  assert.equal(manager.willShowOnNext(), true);

  assert.equal(await manager.showIfDue(), true);
  assert.equal(calls.show, 1);
  assert.equal(preferences.adProgress.solvesSinceAd, 0);
  assert.ok(saved >= 5);
});

test("browser builds never request or block on native ads", async (context) => {
  const originalCapacitor = globalThis.Capacitor;
  delete globalThis.Capacitor;
  context.after(() => {
    if (originalCapacitor !== undefined) globalThis.Capacitor = originalCapacitor;
  });

  const manager = createAdManager({ preferences: {}, savePreferences: () => {} });
  await manager.initialize();
  for (let solved = 0; solved < 8; solved += 1) manager.recordSolve();
  assert.equal(manager.willShowOnNext(), false);
  assert.equal(await manager.showIfDue(), false);
});
