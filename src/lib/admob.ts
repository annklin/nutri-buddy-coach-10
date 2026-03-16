import {
  AdMob,
  AdmobConsentStatus,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents
} from '@capacitor-community/admob';

const INTERSTITIAL_AD_UNIT = 'ca-app-pub-9088121551421320/1581297367';
const REWARDED_AD_UNIT = 'ca-app-pub-9088121551421320/8743324289';

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

  } catch (error) {

    console.log("AdMob init error", error);

    isNative = false;
    initialized = true;

  }

}

export async function showInterstitialAd(): Promise<boolean> {

  if (!isNative) return false;

  try {

    await AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_UNIT,
      isTesting: true
    });
await AdMob.showRewardVideoAd();
    return new Promise<boolean>(async (resolve) => {

      const dismiss = await AdMob.addListener(
        InterstitialAdPluginEvents.Dismissed,
        () => {
          cleanup();
          resolve(true);
        }
      );

      const fail = await AdMob.addListener(
        InterstitialAdPluginEvents.FailedToShow,
        () => {
          cleanup();
          resolve(false);
        }
      );

      function cleanup() {
        dismiss.remove();
        fail.remove();
      }

      await AdMob.showInterstitial();

    });

  } catch (error) {

    console.log("Interstitial error", error);

    return false;

  }

}

export async function showRewardedAd(): Promise<boolean> {

  if (!isNative) return false;

  try {

    await AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_UNIT,
      isTesting: true
    });

    return new Promise<boolean>(async (resolve) => {

      const rewarded = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
          cleanup();
          resolve(true);
        }
      );

      const dismiss = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {
          cleanup();
          resolve(false);
        }
      );

      const fail = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        () => {
          cleanup();
          resolve(false);
        }
      );

      function cleanup() {
        
        dismiss.remove();
        fail.remove();
      }

      await AdMob.showRewardVideoAd();

    });

  } catch (error) {

    console.log("Rewarded error", error);

    return false;

  }

}
