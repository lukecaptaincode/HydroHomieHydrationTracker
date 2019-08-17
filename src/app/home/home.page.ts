import { DropLoaderComponent } from './../components/drop-loader/drop-loader.component';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AdMobFreeService } from './../services/ad-mob-free.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  user: any;
  isLoading: boolean;
  waterBottleProgress: number;
  constructor(
    public userService: UserService,
    public alertController: AlertController,
    public navCtrl: NavController,
    public adMobFreeService: AdMobFreeService
  ) {
    this.isLoading = true;
    setTimeout(() => {
      this.user = userService.getUser();
      if (this.user === null || this.user === undefined) {
        this.user = userService.createNewUser();
      }
      this.isLoading = false;
      this.calculateWaterBottleProgress(
        this.user.millilitersCurrentLevel,
        this.user.millilitersToNextLevel
      );
    }, 5000);
  }
  ngOnInit() {
    this.adMobFreeService.createBannerAd();
  }
  ionViewWillEnter() {
    this.user = this.userService.getUser();
    this.calculateWaterBottleProgress(
      this.user.millilitersCurrentLevel,
      this.user.millilitersToNextLevel
    );
  }
  addMilliliters(milliliters: number) {
    this.userService.addMilliliters(milliliters);
    this.user = this.userService.getUser();
    try {
      this.calculateWaterBottleProgress(
        this.user.millilitersCurrentLevel,
        this.user.millilitersToNextLevel
      );
    } catch (error) {
      console.log('Ignore me' + error);
    }
  }
  calculateWaterBottleProgress(percentFor: number, percentOf: number) {
    if (percentFor === null || percentFor === undefined) {
      percentFor = 0;
    }
    this.waterBottleProgress = Math.floor((percentFor / percentOf) * 100);
  }

  async presentHydrationPrompt() {
    const alert = await this.alertController.create({
      header: 'How many ml you hydrating by?',
      inputs: [
        {
          name: 'milliliters',
          type: 'number',
          placeholder: 'ml',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Moisten!',
          handler: data => {
            console.log(data.milliliters);
            this.addMilliliters(Number(data.milliliters));
          },
        },
      ],
    });

    await alert.present();
  }
}
