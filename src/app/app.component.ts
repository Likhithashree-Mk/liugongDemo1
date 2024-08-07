import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, Nav, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
import { GlobalProvider } from '../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { MachinesupdatelistPage } from '../pages/machines/machinesupdatelist/machinesupdatelist';
import { ContactlistPage } from '../pages/contact/contactlist/contactlist';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  rootPage: any = LoginPage;

  @ViewChild(Nav) nav: Nav;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public app: App,
    public alertCtrl: AlertController,
    public splashScreen: SplashScreen,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.initializeApp();

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

  ngOnInit() {

    // if (this.global.CheckInternetConnection()) {

    //   this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetRatingReasonAPI", {
    //     headers: this.global.ApiReadHeaders
    //   }).subscribe(RatingReasonData => {

    //     console.log(RatingReasonData);

    //     this.global.RatingReasonData = RatingReasonData;

    //   }, error => {

    //     console.log(error);

    //   });

    // }
    // else {
    //   this.global.ToastShow("Please check your internet connection");
    // }

  }

  initializeApp() {

    this.platform.registerBackButtonAction(() => {

      this.BackButtonClick();

    });

  }

  BackButtonClick() {

    let nav = this.app.getActiveNavs()[0];
    let activeView = nav.getActive();

    switch (activeView.name) {

      case "HomePage":

        if (!this.global.IsAlertOpen) {
          this.LogoutPopup();
        }
        break;

      case "RegistrationPage":
        this.nav.setRoot(LoginPage);
        break;

      case "LoginotpPage":
        this.nav.setRoot(LoginPage);
        break;

      case "LoginPage":
        this.platform.exitApp();
        break;

      case "MachinesupdatePage":
        this.nav.setRoot(MachinesupdatelistPage);
        break;

      case "FeedbackPage":
      case "TrackingPage":
      case "TicketsPage":
      case "MachinesPage":
      case "CallbackPage":
      case "ContactlistPage":
      case "MachinesupdatelistPage":
        this.nav.setRoot(HomePage);
        break;

      case "ContacteditPage":
      case "ContactaddPage":
        this.nav.setRoot(ContactlistPage);
        break;

      case "ModalCmp":

        break;

      default:
        this.nav.setRoot(LoginPage);
        break;

    }

  }

  LogoutPopup() {

    this.global.IsAlertOpen = true;

    let LogoutAlert = this.alertCtrl.create({
      subTitle: 'Warning',
      message: 'Are You Sure Do You Want To Exit?',
      buttons: [
        {
          text: 'Logout',
          cssClass: 'BtnTwoPopup',
          handler: data => {
            this.platform.exitApp();
            this.global.IsAlertOpen = false;
          }
        },
        {
          text: 'Cancel',
          cssClass: 'BtnTwoPopup',
          handler: data => {
            this.global.IsAlertOpen = false;
          }
        }
      ],
      enableBackdropDismiss: false
    });

    LogoutAlert.present();

  }

}