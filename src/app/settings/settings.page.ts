import { AdMobFreeService } from './../services/ad-mob-free.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    public userService: UserService,
    public alertController: AlertController,
    public adMobFreeService: AdMobFreeService
  ) {
    this.adMobFreeService.createBannerAd();
  }

  ngOnInit() {}
  async clearUserData() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to clear all user data?',
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
          text: 'Clear user data',
          handler: () => {
            this.userService.clearUserData();
          },
        },
      ],
    });
    await alert.present();
  }
}
