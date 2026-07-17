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
});

const GOOGLE_IOS_INTERSTITIAL_DEMO_ID = "ca-app-pub-3940256099942544/4411468910";

export function validateAdConfig(config = AD_CONFIG) {
  const usesGoogleDemoId = config.interstitialAdId === GOOGLE_IOS_INTERSTITIAL_DEMO_ID;
  if (config.testMode && !usesGoogleDemoId) {
    throw new Error("Test mode must use Google's iOS interstitial demo ad unit ID.");
  }
  if (!config.testMode && usesGoogleDemoId) {
    throw new Error("Production mode requires a production AdMob interstitial ad unit ID.");
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

  preferences.adProgress = normalizeAdProgress(preferences.adProgress);

  function notify() {
    onStateChange({ ready, canRequestAds, privacyOptionsRequired });
  }

  function adOptions() {
    return {
      adId: AD_CONFIG.interstitialAdId,
      npa: AD_CONFIG.nonPersonalizedAds,
    };
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
    if (canRequestAds) await prepare();
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
      ]);
      await updateConsent();
    } catch {
      canRequestAds = false;
      ready = false;
      notify();
    }
  }

  function recordSolve() {
    preferences.adProgress = recordSolvedPuzzle(preferences.adProgress);
    savePreferences();
    notify();
    prepare();
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
