import { AdMob } from "@capacitor-community/admob"

export async function iniciarAds() {
  await AdMob.initialize()
}

export async function anuncioMacros() {

  await AdMob.prepareInterstitial({
    adId: "ca-app-pub-9088121551421320/8743324289"
  })

  await AdMob.showInterstitial()

}

export async function anuncio5Alimentos() {

  await AdMob.prepareInterstitial({
    adId: "ca-app-pub-9088121551421320/1581297367"
  })

  await AdMob.showInterstitial()

}
