import { Injectable } from '@angular/core';
import {
  AdMobFree,
  AdMobFreeBannerConfig,
} from '@ionic-native/admob-free/ngx';
@Injectable({
  providedIn: 'root',
})
export class AdMobFreeService {
  constructor(public admobFree: AdMobFree) {}
  createBannerAd() {
    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      isTesting: true,
      autoShow: true,
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner
      .prepare()
      .then(() => {
        console.log('banner ready');
      })
      .catch(e => console.log(e));
  }
}
