import test from "node:test";
import assert from "node:assert/strict";

import { AD_CONFIG } from "../ad-config.mjs";
import {
  isInterstitialDue,
  normalizeAdProgress,
  recordInterstitialShown,
  recordSolvedPuzzle,
} from "../ad-policy.mjs";

test("the first interstitial becomes due only after four solved puzzles", () => {
  let progress = normalizeAdProgress(null);
  for (let solved = 1; solved < AD_CONFIG.solvedPuzzlesPerAd; solved += 1) {
    progress = recordSolvedPuzzle(progress);
    assert.equal(isInterstitialDue(progress, { ...AD_CONFIG, now: 1_000 }), false);
  }
  progress = recordSolvedPuzzle(progress);
  assert.equal(isInterstitialDue(progress, { ...AD_CONFIG, now: 1_000 }), true);
});

test("showing an ad resets the solve count and enforces the ten-minute interval", () => {
  const shownAt = 1_000;
  let progress = recordInterstitialShown({ solvesSinceAd: 8, lastShownAt: 0 }, shownAt);
  assert.deepEqual(progress, { solvesSinceAd: 0, lastShownAt: shownAt });

  for (let solved = 0; solved < AD_CONFIG.solvedPuzzlesPerAd; solved += 1) progress = recordSolvedPuzzle(progress);
  assert.equal(isInterstitialDue(progress, { ...AD_CONFIG, now: shownAt + AD_CONFIG.minimumIntervalMs - 1 }), false);
  assert.equal(isInterstitialDue(progress, { ...AD_CONFIG, now: shownAt + AD_CONFIG.minimumIntervalMs }), true);
});

test("release configuration remains on Google's official iOS demo ad unit until production IDs are supplied", () => {
  assert.equal(AD_CONFIG.testMode, true);
  assert.equal(AD_CONFIG.interstitialAdId, "ca-app-pub-3940256099942544/4411468910");
  assert.equal(AD_CONFIG.bannerAdId, "ca-app-pub-3940256099942544/2435281174");
  assert.equal(AD_CONFIG.bannerAdSize, "ADAPTIVE_BANNER");
  assert.equal(AD_CONFIG.nonPersonalizedAds, true);
});
