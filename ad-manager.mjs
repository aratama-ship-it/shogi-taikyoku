import { AD_CONFIG } from "./ad-config.mjs";
import {
  isInterstitialDue,
  normalizeAdProgress,
  recordInterstitialShown,
  recordSolvedPuzzle,
} from "./ad-policy.mjs";

const EVENTS = Object.freeze({
  dismissed: "interstitialAdDismissed",
  failedToLoad: "interstitialAdFailedToLoad",
  failedToShow: "interstitialAdFailedToShow",
  bannerSizeChanged: "bannerAdSizeChanged",
  bannerFailedToLoad: "bannerAdFailedToLoad",
});

const GOOGLE_IOS_INTERSTITIAL_DEMO_ID = "ca-app-pub-3940256099942544/4411468910";
const GOOGLE_IOS_BANNER_DEMO_ID = "ca-app-pub-3940256099942544/2435281174";

export function validateAdConfig(config = AD_CONFIG) {
  const adUnits = [
    ["interstitial", config.interstitialAdId, GOOGLE_IOS_INTERSTITIAL_DEMO_ID],
    ["banner", config.bannerAdId, GOOGLE_IOS_BANNER_DEMO_ID],
  ];
  for (const [format, adId, demoId] of adUnits) {
    const usesGoogleDemoId = adId === demoId;
    if (config.testMode && !usesGoogleDemoId) {
      throw new Error(`Test mode must use Google's iOS ${format} demo ad unit ID.`);
    }
    if (!config.testMode && usesGoogleDemoId) {
      throw new Error(`Production mode requires a production AdMob ${format} ad unit ID.`);
    }
  }
  return true;
}

function nativeAdMobPlugin() {
  const capacitor = globalThis.Capacitor;
  if (!AD_CONFIG.enabled || !capacitor?.isNativePlatform?.() || !capacitor?.isPluginAvailable?.("AdMob")) return null;
  return capacitor.Plugins?.AdMob || capacitor.registerPlugin?.("AdMob") || null;
}

export function createAdManager({ preferences, savePreferences, onStateChange = () => {} }) {
  let plugin = null;
  let initialized = false;
  let ready = false;
  let canRequestAds = false;
  let privacyOptionsRequired = false;
  let preparing = null;
  let bannerRequested = false;
  let bannerHeight = 0;

  preferences.adProgress = normalizeAdProgress(preferences.adProgress);

  function notify() {
    onStateChange({ ready, canRequestAds, privacyOptionsRequired, bannerHeight });
  }

  function adOptions() {
    return {
      adId: AD_CONFIG.interstitialAdId,
      npa: AD_CONFIG.nonPersonalizedAds,
    };
  }

  function bannerOptions() {
    return {
      adId: AD_CONFIG.bannerAdId,
      adSize: AD_CONFIG.bannerAdSize,
      position: AD_CONFIG.bannerPosition,
      margin: AD_CONFIG.bannerMargin,
      npa: AD_CONFIG.nonPersonalizedAds,
    };
  }

  function updateBannerHeight(value) {
    bannerHeight = Math.max(0, Number(value) || 0);
    notify();
  }

  async function showBanner() {
    if (!AD_CONFIG.bannerEnabled || !plugin || !canRequestAds || bannerRequested) return false;
    bannerRequested = true;
    try {
      await plugin.showBanner(bannerOptions());
      return true;
    } catch {
      bannerRequested = false;
      updateBannerHeight(0);
      return false;
    }
  }

  async function removeBanner() {
    if (!plugin || !bannerRequested) return;
    bannerRequested = false;
    updateBannerHeight(0);
    try {
      await plugin.removeBanner();
    } catch {
      // The banner is already gone; keep the web layout unreserved.
    }
  }

  async function prepare() {
    if (!plugin || !canRequestAds || ready) return false;
    if (preparing) return preparing;
    preparing = plugin.prepareInterstitial(adOptions())
      .then(() => {
        ready = true;
        notify();
        return true;
      })
      .catch(() => false)
      .finally(() => {
        preparing = null;
      });
    return preparing;
  }

  async function updateConsent() {
    let info = await plugin.requestConsentInfo();
    if (!info.canRequestAds && info.isConsentFormAvailable) info = await plugin.showConsentForm();
    canRequestAds = Boolean(info.canRequestAds);
    privacyOptionsRequired = info.privacyOptionsRequirementStatus === "REQUIRED";
    notify();
    if (canRequestAds) await Promise.all([prepare(), showBanner()]);
    else await removeBanner();
  }

  async function initialize() {
    if (initialized) return;
    initialized = true;
    plugin = nativeAdMobPlugin();
    if (!plugin) return;

    try {
      validateAdConfig();
      await plugin.initialize({ maxAdContentRating: AD_CONFIG.maxAdContentRating });
      await Promise.all([
        plugin.addListener(EVENTS.dismissed, () => {
          ready = false;
          notify();
          prepare();
        }),
        plugin.addListener(EVENTS.failedToLoad, () => {
          ready = false;
          notify();
        }),
        plugin.addListener(EVENTS.failedToShow, () => {
          ready = false;
          notify();
          prepare();
        }),
        plugin.addListener(EVENTS.bannerSizeChanged, (size) => {
          updateBannerHeight(size?.height);
        }),
        plugin.addListener(EVENTS.bannerFailedToLoad, () => {
          bannerRequested = false;
          updateBannerHeight(0);
        }),
      ]);
      await updateConsent();
    } catch {
      canRequestAds = false;
      ready = false;
      bannerRequested = false;
      bannerHeight = 0;
      notify();
    }
  }

  function recordSolve() {
    preferences.adProgress = recordSolvedPuzzle(preferences.adProgress);
    savePreferences();
    notify();
    prepare();
    showBanner();
  }

  function willShowOnNext() {
    return Boolean(plugin && ready && canRequestAds && isInterstitialDue(preferences.adProgress, AD_CONFIG));
  }

  async function showIfDue() {
    if (!willShowOnNext()) return false;
    ready = false;
    notify();
    try {
      await plugin.showInterstitial();
      preferences.adProgress = recordInterstitialShown(preferences.adProgress);
      savePreferences();
      return true;
    } catch {
      prepare();
      return false;
    }
  }

  async function showPrivacyOptions() {
    if (!plugin || !privacyOptionsRequired) return false;
    try {
      await plugin.showPrivacyOptionsForm();
      await updateConsent();
      return true;
    } catch {
      return false;
    }
  }

  return {
    initialize,
    recordSolve,
    showIfDue,
    showPrivacyOptions,
    willShowOnNext,
    isPrivacyOptionsRequired: () => privacyOptionsRequired,
  };
}
