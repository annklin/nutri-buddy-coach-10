import { AdMob, AdmobConsentStatus, InterstitialAdPluginEvents } from '@capacitor-community/admob';

const INTERSTITIAL_AD_UNIT = 'ca-app-pub-9088121551421320/1581297367';

let initialized = false;
let isNative = false;

export async function initAdMob(): Promise<void> {
  if (initialized) return;

  try {
    await AdMob.initialize();

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
      const onDismiss = AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        onDismiss.then(h => h.remove());
        onFail.then(h => h.remove());
        resolve();
      });
      const onFail = AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
        onDismiss.then(h => h.remove());
        onFail.then(h => h.remove());
        resolve();
      });
    });

    await AdMob.showInterstitial();
    return true;
  } catch {
    return false;
  }
}
