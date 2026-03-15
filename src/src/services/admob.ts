import { AdMob } from "@capacitor-community/admob";

export async function iniciarAds() {
  await AdMob.initialize();
}

export async function showRewardedAd() {
  try {
    await AdMob.prepareRewardVideoAd({
      adId: "ca-app-pub-3940256099942544/5224354917" // teste
    });

    await AdMob.showRewardVideoAd();

    return true;
  } catch (error) {
    console.log("Erro rewarded", error);
    return false;
  }
}

export async function showInterstitialAd() {
  try {
    await AdMob.prepareInterstitial({
      adId: "ca-app-pub-3940256099942544/1033173712" // teste
    });

    await AdMob.showInterstitial();

    return true;
  } catch (error) {
    console.log("Erro interstitial", error);
    return false;
  }
}
