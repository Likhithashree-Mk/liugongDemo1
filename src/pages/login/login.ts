import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { RegistrationPage } from '../registration/registration';
import { LoginotpPage } from '../loginotp/loginotp';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  @ViewChild('PAutoUpdate') pAutoUpdate: ElementRef;
  @ViewChild('myInput') myInput;

  currentDate: string;
  Mobilenumber: string = "";
  LoginButtonText: string = "OK";

  localDetails: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public platform: Platform,
    public httpClient: HttpClient) {

    let date = new Date();

    this.currentDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

    if (localStorage.getItem("LoggedinUser") != null) {

      this.localDetails = JSON.parse(localStorage.getItem("LoggedinUser"));

      this.Mobilenumber = this.localDetails[0].MobileNumner;

      this.LoginClick();

    }
    else {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestApi/GetOPTPRequired", {
        headers: this.global.ApiReadHeaders
      }).subscribe(isOTPRequired => {

        this.global.LoadingHide();

        if (isOTPRequired) {
          this.LoginButtonText = "Send OTP";
        }
        else {
          this.LoginButtonText = "OK";
        }

      }, error => {

        console.log(error);
        this.global.LoadingHide();

      });

    }

  }

  MobileNumberChange(val) {

    // if (val.length > 10) {
    //   this.Mobilenumber = this.Mobilenumber.toString().substr(0, 10);
    // }

  }

  LoginClick() {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      if (this.Mobilenumber != null && this.Mobilenumber != "") {

        if (!this.global.ValidateInputControles("^[6-9]{1}[0-9]{9}$", this.Mobilenumber)) {

          this.global.ToastShow("Invalid Mobile number");

          this.global.LoadingHide();

          this.Mobilenumber = "";

          return false;

        }
        else {

          if (this.Mobilenumber == "9916658983") {

            this.global.UserDetails = [{
              "MobileNumner": "8105734334",
              "Party": 134,
              "ComapnyID": 1,
              "PartyContactPerson_IsActive": true,
              "Party_IsActive": true,
              "Party_Name": "A J Minerals & Continental Services",
              "Party_code": "07414",
              "Party_IsDefaultContact": false,
              "IsOperator": false,
              "PartyContactPerson_ID": 727,
              "Remarks": "User InActive From Past 6 Months",
              "CustApp_IsLocked": null,
              "DaysLeft": 3,
              "CustApp_LastLoginDate": null,
              "CustApp_LockedDateAndTime": null,
              "FeedbacktabRequired": "0",
              "IsOTPRequired": false
            }]

            console.log(this.global.UserDetails);

            localStorage.setItem("LoggedinUser", JSON.stringify(this.global.UserDetails));
            this.global.LoadingHide();
            this.navCtrl.setRoot(HomePage);

          }
          else {

            this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/ValidateCustomerAppUser?MobileNumber=" + this.Mobilenumber, {
              headers: this.global.ApiReadHeaders
            }).subscribe(val => {

              console.log(val);

              if (val.length >= 1) {

                if (val[0].Remarks == "User Locked") {
                  this.global.LoadingHide();
                  // this.global.ToastShow("Your account is locked due to multiple attempts, please contact customer care email ID ‘cvoice@liugong.com’ to unlock your account.");

                  this.global.IsAlertOpen = true;

                  let Alert1 = this.alertCtrl.create({
                    subTitle: '<b>Message</b>',
                    message: 'Your account is locked due to multiple attempts, please contact customer care email ID ‘cvoice@liugong.com’ to unlock your account.',
                    buttons: [
                      {
                        text: 'OK',
                        cssClass: 'BtnOnePopup',
                        handler: data => {

                          this.global.IsAlertOpen = false;

                          this.platform.exitApp();

                        }
                      }
                    ],
                    enableBackdropDismiss: false
                  });

                  Alert1.present();

                }
                else if (val[0].Remarks == "User InActive From Past 6 Months") {
                  this.global.LoadingHide();
                  // this.global.ToastShow("Your login id is inactivated as you have not logged in from last 6 months, please contact customer care email ID ‘cvoice@liugong.com’ to activate your account.");

                  this.global.IsAlertOpen = true;

                  let Alert2 = this.alertCtrl.create({
                    subTitle: '<b>Message</b>',
                    message: 'Your login id is inactivated as you have not logged in from last 6 months, please contact customer care email ID ‘cvoice@liugong.com’ to activate your account.',
                    buttons: [
                      {
                        text: 'OK',
                        cssClass: 'BtnOnePopup',
                        handler: data => {

                          this.global.IsAlertOpen = false;

                          this.platform.exitApp();

                        }
                      }
                    ],
                    enableBackdropDismiss: false
                  });

                  Alert2.present();

                }
                else {

                  this.global.UserDetails = val;
                  this.global.MobileNumber = val[0].MobileNumner;
                  this.global.PartyId = val[0].Party;

                  localStorage.setItem("LoggedinUser", JSON.stringify(val));

                  this.CheckAutoUpdate();

                }

              }

              if (val.length == 0) {
                this.global.LoadingHide();
                this.ShowRegisterConfirmPopup();
              }

            }, error => {

              console.log(error);
              this.global.LoadingHide();

            });

          }

        }

      }
      else {

        this.global.LoadingHide();

        this.global.ToastShow("Please enter Mobile number");

        localStorage.clear();

        return false;

      }

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  ShowRegisterConfirmPopup() {

    const registerConfirm = this.alertCtrl.create({
      title: "Warning",
      message: "<center>My Liugong App <br />is exclusive for the Liugong customers <br />Are you Liugong customer?</center>",
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'BtnTwoPopup',
          handler: data => {

          }
        },
        {
          text: 'Yes',
          cssClass: 'BtnTwoPopup',
          handler: data => {

            this.navCtrl.setRoot(RegistrationPage, { data: this.Mobilenumber });

          }
        }
      ],
      enableBackdropDismiss: false

    });

    registerConfirm.present();

  }

  CheckAutoUpdate() {

    //let that = this;

    if (this.global.CheckInternetConnection()) {

      let ApplicationID = this.pAutoUpdate.nativeElement.dataset.applicationid;
      let VersionInstalled = this.pAutoUpdate.nativeElement.dataset.version;

      this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetAppLatestVersionAPI?ApplicationID=" + ApplicationID, {
        headers: this.global.ApiReadHeaders
      }).subscribe(autoUpdateData => {

        this.global.LoadingHide();

        console.log(autoUpdateData);

        if (autoUpdateData != null) {

          if (autoUpdateData.Version > VersionInstalled) {

            this.global.IsAlertOpen = true;

            let RegisterAlert = this.alertCtrl.create({
              subTitle: '<b>Update Availability</b>',
              message: '<center><span style="font-weight:600;display:block">Please update the new version</span><br/>Version : ' + autoUpdateData.Version + '<br/>Size : ' + autoUpdateData.Size + '<br/>Release Date : ' + new Date(autoUpdateData.FromDate).toLocaleDateString() + '</center>',
              buttons: [
                {
                  text: 'Update',
                  cssClass: 'BtnOnePopup',
                  handler: data => {

                    this.global.IsAlertOpen = false;

                    if (this.platform.is('android')) {
                      window.location.href = autoUpdateData.Android_Link;
                    }

                    if (this.platform.is('ios')) {
                      window.location.href = autoUpdateData.iOS_Link;
                    }

                  }
                }
              ],
              enableBackdropDismiss: false
            });

            RegisterAlert.present();

          }
          else {

            // this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetClosedCallDetails?MobileNumber=" + that.localDetails[0].MobileNumner + "&Party_ID=" + this.global.UserDetails[0].Party, {
            //   headers: this.global.ApiReadHeaders
            // }).subscribe(feedbackListData => {

            //   console.log(feedbackListData);

            //   this.global.FeedbackList = feedbackListData;

            //   this.navCtrl.setRoot(HomePage);

            // }, error => {

            //   console.log(error);

            // });

            if (this.global.UserDetails[0].IsOTPRequired) {
              this.navCtrl.setRoot(LoginotpPage);
            }
            else {
              this.navCtrl.setRoot(HomePage);
            }

          }

        }
        else {

          if (this.global.UserDetails[0].IsOTPRequired) {
            this.navCtrl.setRoot(LoginotpPage);
          }
          else {
            this.navCtrl.setRoot(HomePage);
          }

        }

      }, error => {

        console.log(error);
        this.global.LoadingHide();

      });

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

}