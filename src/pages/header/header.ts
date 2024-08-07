import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform, AlertController } from 'ionic-angular';
import { GlobalProvider } from "../../providers/global/global";
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';
import { TicketsPage } from '../tickets/tickets';
import { TrackingPage } from '../tracking/tracking';
import { CallbackPage } from '../callback/callback';
import { LoginPage } from '../login/login';
import { ContactlistPage } from '../contact/contactlist/contactlist';
import { MachinesupdatelistPage } from '../machines/machinesupdatelist/machinesupdatelist';

@IonicPage()
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
    public platform: Platform,
    public alertCtrl: AlertController) {
  }

  HeaderBackClick() {

    let nav = this.app.getActiveNavs()[0];
    let activeView = nav.getActive();

    this.global.sidemenushow = true;

    switch (activeView.name) {

      case "HomePage":

        if (!this.global.IsAlertOpen) {
          this.LogoutPopup();
        }
        break;

      case "RegistrationPage":
        this.navCtrl.setRoot(LoginPage);
        break;

      case "LoginotpPage":
        this.navCtrl.setRoot(LoginPage);
        break;

      case "LoginPage":
        this.platform.exitApp();
        break;

      case "MachinesupdatePage":
        this.navCtrl.setRoot(MachinesupdatelistPage);
        break;

      case "FeedbackPage":
      case "TrackingPage":
      case "TicketsPage":
      case "MachinesPage":
      case "CallbackPage":
      case "ContactlistPage":
      case "MachinesupdatelistPage":
        this.navCtrl.setRoot(HomePage);
        break;

      case "ContacteditPage":
      case "ContactaddPage":
        this.navCtrl.setRoot(ContactlistPage);
        break;

      case "ModalCmp":

        break;

      default:
        this.navCtrl.setRoot(LoginPage);
        break;

    }

  }

  HeaderSideMenuClick() {
    this.global.sidemenushow = !this.global.sidemenushow;
  }

  HeaderHomeClick() {

    let nav = this.app.getActiveNavs()[0];
    let activeView = nav.getActive();

    this.global.sidemenushow = true;

    if (activeView.name != "HomePage") {
      this.global.HeaderTitle = "Home";
      this.navCtrl.setRoot(HomePage);
    }

  }

  SideMenuCallUsClick() {

    this.global.IsAlertOpen = true;

    const callback = this.alertCtrl.create({
      subTitle: "Confirm",
      message: "<center>Do you want to call to Toll free number?</center>",
      buttons: [
        {
          text: 'Cancel',
          cssClass:"BtnTwoPopup",
          handler: data => {
            this.global.IsAlertOpen = false;
          }
        },
        {
          text: 'OK',
          cssClass:"BtnTwoPopup",
          handler: data => {

            window.location.href = "tel:18002672600";
            this.global.IsAlertOpen = false;

          }
        }
      ],
      enableBackdropDismiss: false
    });

    callback.present();

  }

  SideMenuRequestCallBackClick() {

    this.navCtrl.setRoot(CallbackPage);

  }

  SieMenuFeedbackClick() {

    if (this.global.FeedbackList.length > 0) {
      this.navCtrl.setRoot(FeedbackPage);
    }
    else {
      this.global.ToastShow("There is no closed case to give feedback");
    }

  }

  SieMenuServiceRequestClick() {
    this.navCtrl.setRoot(TicketsPage);
  }

  SieMenuTrackYourRequestClick() {
    this.navCtrl.setRoot(TrackingPage);
  }

  SideMenuAboutClick() {

    this.global.IsAlertOpen = true;

    const callback = this.alertCtrl.create({
      subTitle: "MyLiugong",
      message: "<center>Version : 1.0.0 <br /><br />Size : 10 MB</center>",
      buttons: [
        {
          text: 'OK',
          cssClass: 'BtnOnePopup',
          handler: data => {
            this.global.IsAlertOpen = false;
          }
        }
      ],
      enableBackdropDismiss: false
    });

    callback.present();

  }

  SideMenuLogoutClick() {

    this.LogoutPopup();

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
      enableBackdropDismiss:false
    });

    LogoutAlert.present();

  }

}
