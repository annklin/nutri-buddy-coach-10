import {
  AdMob,
  RewardAdPluginEvents,
} from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

const REWARDED_AD_UNIT = "ca-app-pub-9088121551421320/8743324289";
const INTERSTITIAL_AD_UNIT = "ca-app-pub-9088121551421320/1581297367";

let initialized = false;
let isNative = false;

export async function initAdMob(): Promise<void> {
  if (initialized) return;

  // 🔥 evita crash na web
  if (Capacitor.getPlatform() !== "android") {
    console.log("AdMob ignorado (web)");
    return;
  }

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: false,
      initializeForTesting: true, // ⚠️ depois trocamos pra false
    });

    isNative = true;
    console.log("AdMob iniciado");
  } catch (error) {
    console.log("Erro ao iniciar AdMob:", error);
    isNative = false;
  }

  initialized = true;
}

export async function showInterstitialAd(): Promise<void> {
  if (!isNative) return;

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
  if (!isNative) return false;

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
