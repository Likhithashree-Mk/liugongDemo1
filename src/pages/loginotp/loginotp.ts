import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-loginotp',
  templateUrl: 'loginotp.html',
})
export class LoginotpPage {

  // SMSTemplateDetails: any = [{
  //   'ApiKey': 'Ada80004d4daf58439f04aef8158fbb19',
  //   'SenderId': 'QUINPL',
  //   'TemplateId': '1107169866689258589',
  //   'EntityId': '1201159905584721717'
  // }];

  SMSTemplateDetails: any = [{
    'user': 'questin',
    'password': '921ad77a30XX',
    'senderid': 'QUINPL',
    'tempid': '1107169866689258589',
  }];

  Otp: any;
  EnteredOTP: string = "";
  ResendOTPTime: any = 30;
  IncorrectAttempts: number = 0;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.SendOTP(this.global.UserDetails[0].MobileNumner);

    this.ResendOTPTimer();

  }

  OTPChange(val) {

    // if (val.length > 4) {
    //   this.EnteredOTP = this.EnteredOTP.toString().substr(0, 4);
    // }

  }

  LoginClick(enteredOTP) {

    if (enteredOTP.length == 4 && enteredOTP != undefined && enteredOTP != null) {

      if (enteredOTP != this.Otp) {

        if (this.IncorrectAttempts <= 9) {

          this.global.ToastShow("Incorrect OTP");
          this.EnteredOTP = "";
          this.IncorrectAttempts = this.IncorrectAttempts + 1;
          console.log(this.IncorrectAttempts);

        }
        else {

          this.global.LoadingShow("Please wait...");

          this.httpClient.post(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateIsLocked?mobile=" + this.global.UserDetails[0].MobileNumner, null, {
            headers: this.global.ApiUpdatetHeaders
          }).subscribe(updateIsLocked => {

            console.log(updateIsLocked);

            if (updateIsLocked == "1") {

              this.global.IsAlertOpen = true;

              let RegisterAlert = this.alertCtrl.create({
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

              RegisterAlert.present();

            }
            else {
              this.global.ToastShow("Something went wrong, please try again later");
            }

            this.global.LoadingHide();

          }, error => {

            console.log(error);
            this.global.LoadingHide();

          });

        }

      }
      else {

        if (this.ResendOTPTime > 0) {
          this.global.ToastShow("Logged in Successfully");
          this.navCtrl.setRoot(HomePage);
        }
        else {
          this.global.ToastShow("OTP is expired, please try Resend option");
          this.EnteredOTP = "";
        }

      }

    }
    else {
      this.global.ToastShow("Please enter 4 digit OTP");
    }

  }

  ResendOTPClick() {

    this.ResendOTPTimer();

    this.SendOTP(this.global.UserDetails[0].MobileNumner);

  }

  public SendOTP(MobileNumber) {

    this.Otp = Math.floor(1000 + Math.random() * 9000);

    console.log(this.Otp);

    this.global.LoadingShow("Sending OTP...");

    let message = "Dear customer, " + this.Otp + " is your one time password (OTP) for QUEST My Liugong App authentication. OTP will valid for 30Sec and Don't share with anyone"

    // this.httpClient.get("http://alerts.jiffysms.com/api/v3/index.php?method=sms&api_key=" + this.SMSTemplateDetails[0].ApiKey + "&to=" + MobileNumber + "&sender=" + this.SMSTemplateDetails[0].SenderId + "&message=" + message + "&entity_id=" + this.SMSTemplateDetails[0].EntityId + "&template_id=" + this.SMSTemplateDetails[0].TemplateId).subscribe(sendSMSValue => {

    this.httpClient.get("http://instant.jiffysms.com/sendsms.jsp?user=" + this.SMSTemplateDetails[0].user + "&password=" + this.SMSTemplateDetails[0].password + "&senderid=" + this.SMSTemplateDetails[0].senderid + "&tempid=" + this.SMSTemplateDetails[0].tempid + "&mobiles=" + MobileNumber + "&sms=" + message).subscribe(sendSMSValue => {

      console.log(sendSMSValue);

      this.global.ToastShow("OTP Sent Successfully");

      this.global.LoadingHide();

    }, error => {

      console.log(error);

      this.global.ToastShow("OTP Sent Successfully");
      this.global.LoadingHide();

    });

  }

  ResendOTPTimer() {

    let that = this;

    this.ResendOTPTime = 30;

    let timer = setInterval(function () {

      if (that.ResendOTPTime > 0) {
        that.ResendOTPTime -= 1;
        //console.log(that.ResendOTPTime);
      }
      else {
        clearInterval(timer);
      }

    }, 1000);

  }

}