export function normalizeAdProgress(value) {
  return {
    solvesSinceAd: Math.max(0, Number(value?.solvesSinceAd) || 0),
    lastShownAt: Math.max(0, Number(value?.lastShownAt) || 0),
  };
}

export function recordSolvedPuzzle(value) {
  const progress = normalizeAdProgress(value);
  return { ...progress, solvesSinceAd: progress.solvesSinceAd + 1 };
}

export function isInterstitialDue(value, { solvedPuzzlesPerAd, minimumIntervalMs, now = Date.now() }) {
  const progress = normalizeAdProgress(value);
  if (progress.solvesSinceAd < solvedPuzzlesPerAd) return false;
  if (!progress.lastShownAt) return true;
  return now - progress.lastShownAt >= minimumIntervalMs;
}

export function recordInterstitialShown(value, now = Date.now()) {
  const progress = normalizeAdProgress(value);
  return { ...progress, solvesSinceAd: 0, lastShownAt: now };
}
