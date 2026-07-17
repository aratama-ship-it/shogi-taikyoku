export const AD_CONFIG = Object.freeze({
  enabled: true,
  testMode: true,
  // Google公式のiOSインタースティシャル用デモ広告ID。リリース前に本番IDへ差し替える。
  interstitialAdId: "ca-app-pub-3940256099942544/4411468910",
  solvedPuzzlesPerAd: 4,
  minimumIntervalMs: 10 * 60 * 1000,
  maxAdContentRating: "General",
  nonPersonalizedAds: true,
});
