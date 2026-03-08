import { AdMob, AdmobConsentStatus, InterstitialAdPluginEvents } from '@capacitor-community/admob';

const APP_ID = 'ca-app-pub-9088121551421320~5356890840';
const INTERSTITIAL_AD_UNIT = 'ca-app-pub-9088121551421320/1581297367';

let initialized = false;
let isNative = false;

export async function initAdMob(): Promise<void> {
  if (initialized) return;

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
    });

    const consentInfo = await AdMob.requestConsentInfo();
    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
      await AdMob.showConsentForm();
    }

    isNative = true;
    initialized = true;
  } catch {
    // Not running in Capacitor / native — AdMob unavailable
    isNative = false;
    initialized = true;
  }
}

export async function showInterstitialAd(): Promise<boolean> {
  if (!isNative) return false;

  try {
    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_AD_UNIT,
      isTesting: false,
    });

    await new Promise<void>((resolve) => {
      const cleanup = () => {
        AdMob.removeAllListeners();
        resolve();
      };
      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, cleanup);
      AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, cleanup);
    });

    await AdMob.showInterstitial();
    return true;
  } catch {
    return false;
  }
}
