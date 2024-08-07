import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { FeedbackPage } from '../feedback/feedback';
import { TrackingPage } from '../tracking/tracking';
import { TicketsPage } from '../tickets/tickets';
import { MachinesPage } from '../machines/machines';
import { MachinesupdatelistPage } from '../machines/machinesupdatelist/machinesupdatelist';
import { ContactlistPage } from '../contact/contactlist/contactlist';
import { CallbackPage } from '../callback/callback';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public global: GlobalProvider) {

    this.global.HeaderTitle = "Home";

  }

  HomeCallUsClick() {

    this.global.IsAlertOpen = true;

    const callback = this.alertCtrl.create({
      subTitle: "Confirm",
      message: "<center>Do you want to call to Customer Care number?</center>",
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'BtnTwoPopup',
          handler: data => {
            this.global.IsAlertOpen = false;
          }
        },
        {
          text: 'OK',
          cssClass: 'BtnTwoPopup',
          handler: data => {

            if (this.global.CheckInternetConnection()) {

              this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetTollFreeNumber", {
                headers: this.global.ApiReadHeaders
              }).subscribe(number => {

                this.global.LoadingHide();

                console.log(number);

                if (number != "" && number != undefined && number != null && number != 0) {
                  window.location.href = "tel:" + number;
                }
                else {
                  this.global.ToastShow("Sorry, Currently support number is not available");
                }

              }, error => {

                console.log(error);
                this.global.LoadingHide();

              });

            } else {
              this.global.ToastShow("Please check your internet connection");
            }

            this.global.IsAlertOpen = false;

          }
        }
      ],
      enableBackdropDismiss: false
    });

    callback.present();

  }

  HomeMachineDetailsClick() {

    if (this.global.CheckInternetConnection()) {

      this.navCtrl.setRoot(MachinesPage);

    } else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  HomeServiceRequestClick() {

    if (this.global.CheckInternetConnection()) {

      this.navCtrl.setRoot(TicketsPage);

    } else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  HomeTrackYourRequestClick() {

    if (this.global.CheckInternetConnection()) {

      this.navCtrl.setRoot(TrackingPage);

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  HomeFeedbackClick() {

    if (this.global.CheckInternetConnection()) {
      this.navCtrl.setRoot(FeedbackPage);

      // if (this.global.FeedbackList.length > 0) {
      //   this.navCtrl.setRoot(FeedbackPage);
      // }
      // else {
      //   this.global.ToastShow("There is no closed case to give feedback");
      // }


    } else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  HomeAboutClick() {

    this.global.IsAlertOpen = true;

    const callback = this.alertCtrl.create({
      subTitle: "My Liugong",
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

  DivHomeLogo() {
    this.global.sidemenushow = true;
  }

  HomeMachineUpdateListClick() {
    if (this.global.CheckInternetConnection()) {
      this.navCtrl.setRoot(MachinesupdatelistPage);
    } else {
      this.global.ToastShow("Please check your internet connection");
    }
  }

  HomeContactClick() {
    if (this.global.CheckInternetConnection()) {
      this.navCtrl.setRoot(ContactlistPage);
    } else {
      this.global.ToastShow("Please check your internet connection");
    }
  }

  HomeCallbackClick() {
    if (this.global.CheckInternetConnection()) {
      this.navCtrl.setRoot(CallbackPage);
    } else {
      this.global.ToastShow("Please check your internet connection");
    }
  }


}
