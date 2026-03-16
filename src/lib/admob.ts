import {
  AdMob,
  AdmobConsentStatus,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

const REWARDED_AD_UNIT = 'ca-app-pub-9088121551421320/8743324289'; // seu ID do AdMob

let initialized = false;
let isNative = false;

export async function initAdMob(): Promise<void> {
  if (initialized) return;

  try {
    await AdMob.initialize();

    const consentInfo = await AdMob.requestConsentInfo();
    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
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

/**
 * Mostra um anúncio reward
 * Retorna true se o usuário ganhou a recompensa, false se falhou ou fechou
 */
export async function showRewardedAd(): Promise<boolean> {
  if (!isNative) return false;

  try {
    await AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_UNIT,
      isTesting: true // mude para false quando for produção
    });

    return new Promise<boolean>((resolve) => {
      // Evento de usuário receber a recompensa
      const rewarded = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        cleanup();
        resolve(true);
      });

      // Evento de usuário fechar sem recompensa
      const dismissed = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        cleanup();
        resolve(false);
      });

      const failed = AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
        cleanup();
        resolve(false);
      });

      function cleanup() {
        rewarded.remove();
        dismissed.remove();
        failed.remove();
      }

      // Exibe o anúncio
      AdMob.showRewardVideoAd();
    });

  } catch (error) {
    console.log("Rewarded error", error);
    return false;
  }
}
