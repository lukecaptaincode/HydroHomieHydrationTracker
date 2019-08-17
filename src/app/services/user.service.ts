import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ThrowStmt } from '@angular/compiler';
class User {
  public level: number;
  public millilitersTotal: number;
  public millilitersCurrentLevel: number;
  public millilitersPreviousLevel: number;
  public millilitersToNextLevel: number;

  constructor(
    level: number = 0,
    millilitersTotal: number = 0,
    millilitersCurrentLevel: number = 0,
    millilitersPreviousLevel: number = 0,
    millilitersToNextLevel: number = 0
  ) {
    this.level = level;
    this.millilitersTotal = millilitersTotal;
    this.millilitersCurrentLevel = millilitersCurrentLevel;
    this.millilitersPreviousLevel = millilitersPreviousLevel;
    // If millies to next level is 0 start setting it
    if (
      millilitersToNextLevel === 0 ||
      millilitersToNextLevel === undefined ||
      millilitersToNextLevel === null
    ) {
      // If this is the first level set the millies to 500
      if (
        this.millilitersPreviousLevel === 0 ||
        this.millilitersPreviousLevel === undefined ||
        this.millilitersPreviousLevel === null
      ) {
        this.millilitersToNextLevel = 500;
      } else {
        // else give it the value of the millies if the previous level + 500 and 5%;
        this.millilitersToNextLevel =
          this.millilitersPreviousLevel + 500 * 0.05;
      }
    } else {
      // Else set it to the passed data
      this.millilitersToNextLevel = millilitersToNextLevel;
    }
  }
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: User;
  constructor(private storage: Storage) {
    // Get the user data from storage, if there is no data (e.g first run) and then save the new user;
    this.storage.get('user').then((response: User) => {
      if (!response || response === undefined || response === null) {
        this.user = new User();
        this.saveUserToStorage();
      } else {
        this.user = response;
      }
    });
  }

  addMilliliters(milliliters: number) {
    this.user.millilitersCurrentLevel =
      Number(this.user.millilitersCurrentLevel) + Number(milliliters);
    this.user.millilitersTotal =
      Number(this.user.millilitersTotal) + Number(milliliters);
    this.levelUpCheck();
    this.saveUserToStorage();
  }

  levelUpCheck() {
    if (this.user.millilitersCurrentLevel >= this.user.millilitersToNextLevel) {
      this.user.level = Number(this.user.level) + 1;
      this.user.millilitersPreviousLevel = this.user.millilitersToNextLevel;
      this.user.millilitersCurrentLevel = 0;
      this.user.millilitersToNextLevel =
        Number(this.user.millilitersPreviousLevel) + 500 * 0.05;
    }
  }
  getUser(): User {
    return this.user;
  }

  saveUserToStorage() {
    this.storage.set('user', this.user);
  }
  clearUserData() {
    const newUser = this.createNewUser();
    this.user = newUser;
    this.storage.set('user', newUser);
  }
  createNewUser(): User {
    return new User(0, 0, 0, 0, 500);
  }
}
