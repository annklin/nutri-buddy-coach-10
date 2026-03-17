// lib/admob.ts
import {
  AdMob,
  AdmobConsentStatus,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

const REWARDED_AD_UNIT = 'ca-app-pub-9088121551421320/8743324289'; // substitua pelo seu ID real

let initialized = false;
let isNative = false;

/**
 * Inicializa o AdMob
 */
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
 * Mostra um anúncio Rewarded
 * Retorna true se o usuário ganhou a recompensa, false se falhou ou fechou
 */
export async function showRewardedAd(): Promise<boolean> {
  if (!isNative) return false;

  try {
    // Prepara o anúncio
    await AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_UNIT,
      isTesting: true, // coloque false na produção
    });

    return new Promise<boolean>((resolve) => {
      // Evento usuário recebeu recompensa
      const rewarded = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        cleanup();
        resolve(true);
      });

      // Evento usuário fechou sem recompensa
      const dismissed = AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        cleanup();
        resolve(false);
      });

      // Evento falha ao mostrar
      const failed = AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
        cleanup();
        resolve(false);
      });

      // Remove listeners
      function cleanup() {
        rewarded.remove();
        dismissed.remove();
        failed.remove();
      }

      // Mostra o anúncio
      AdMob.showRewardVideoAd().catch(() => {
        cleanup();
        resolve(false);
      });
    });

  } catch (error) {
    console.log("Rewarded error", error);
    return false;
  }
}

/**
 * Função auxiliar para decidir se deve mostrar anúncio
 * Limitando a 1 anúncio a cada 5 alimentos
 */
export function deveMostrarAd(anunciosAssistidos: number, maxAnuncios: number): boolean {
  return anunciosAssistidos < maxAnuncios;
  }
