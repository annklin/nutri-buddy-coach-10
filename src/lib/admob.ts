import {
  AdMob,
  AdmobConsentStatus,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";
import { Capacitor } from '@capacitor/core';

const REWARDED_AD_UNIT = "ca-app-pub-9088121551421320/8743324289";
const INTERSTITIAL_AD_UNIT = "ca-app-pub-9088121551421320/1581297367";

let initialized = false;
let isNative = false;

export async function initAdMob(): Promise<void> {
  if (initialized) return;

  // 🚨 ESSENCIAL: só roda no app nativo
  if (Capacitor.getPlatform() !== 'android') {
    console.log('AdMob ignorado (web)');
    return;
  }

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: false,
      initializeForTesting: true
    });

    isNative = true;
  } catch (error) {
    console.log('Erro ao iniciar AdMob:', error);
    isNative = false;
  }

  initialized = true;
}

//    const consentInfo = await AdMob.requestConsentInfo();

    if (
      consentInfo.isConsentFormAvailable &&
      consentInfo.status === AdmobConsentStatus.REQUIRED
    ) {
     // await AdMob.showConsentForm();
    }

    isNative = true;
  } catch (error) {
    console.log("AdMob não disponível no ambiente web");
    isNative = false;
  }

  initialized = true;
}

export async function showInterstitialAd(): Promise<void> {
  if (!isNative) {
    console.log("Interstitial ignorado (web)");
    return;
  }

  try {
    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_AD_UNIT,
      isTesting: true,
    });

    await AdMob.showInterstitial();
  } catch (error) {
    console.log("Erro interstitial", error);
  }
}

export async function showRewardedAd(): Promise<boolean> {
  if (!isNative) {
    console.log("Rewarded ad ignorado (web)");
    return false;
  }

  try {
    await AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_UNIT,
      isTesting: true,
    });

    return new Promise<boolean>((resolve) => {
      const rewarded = AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
          cleanup();
          resolve(true);
        }
      );

      const dismissed = AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {
          cleanup();
          resolve(false);
        }
      );

      const failed = AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        () => {
          cleanup();
          resolve(false);
        }
      );

      function cleanup() {
        rewarded.remove();
        dismissed.remove();
        failed.remove();
      }

      AdMob.showRewardVideoAd();
    });
  } catch (error) {
    console.log("Erro rewarded", error);
    return false;
  }
}
