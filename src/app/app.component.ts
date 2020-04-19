import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  splash = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    if (this.splash) {

      setTimeout(() => {
        let audio = new Audio("../assets/audios/beep.wav");
        audio.play();
      }, 4000);
      setTimeout(() => {
        this.splash = false;
      }, 7000);
    }

  }
  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);// probar
      this.splashScreen.hide();
    });
  }
}
