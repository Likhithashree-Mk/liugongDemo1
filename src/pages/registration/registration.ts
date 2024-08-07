import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { GlobalProvider } from '../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})

export class RegistrationPage {

  CustomerName: string = "";
  ContactName: string = "";
  Department: string = "";
  mobileNumber: string = "";
  Email: string = "";
  location: string = "";
  currentDate: string = "";


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public platform: Platform,
    public geolocation: Geolocation,
    public httpClient: HttpClient,
    public global: GlobalProvider) {

    this.mobileNumber = this.navParams.get("data");

    let date = new Date();
    this.currentDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }

  CancelClick() {
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

  SubmitClick() {

    if (this.mobileNumber != null && this.mobileNumber != "") {

      if (!this.global.ValidateInputControles("^[6-9]{1}[0-9]{9}$", this.mobileNumber)) {

        this.global.ToastShow("Invalid Mobile number");

      }
      else {

        if (this.global.CheckInternetConnection()) {

          this.global.LoadingShow("Please wait...");

          let FormDescription = "Customer Name:" + this.CustomerName + ", " + "Contact Name:" + this.ContactName + ", " + "Department:" + this.Department + ", " + "ContactNo:" + this.mobileNumber + ", " + "Email:" + this.Email + ", " + "Location:" + this.location;

          this.httpClient.post<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/CreateVerificationQueue?MobileNumber=" + this.mobileNumber + "&DateTime=" + this.currentDate + "&RequestDescription=" + FormDescription + "&RequestType=1&UserType=1&PartyID=0&companyID=0", null, {
            headers: this.global.ApiInsertHeaders
          }).subscribe(verificationQueueData => {

            console.log(verificationQueueData);

            this.global.LoadingHide();

            if (verificationQueueData.Value == "1") {

              const prompt = this.alertCtrl.create({
                title: 'Message',
                message: "Thank you for your information,our Service Desk team will reach you soon",
                buttons: [
                  {
                    text: 'OK',
                    cssClass: 'BtnOnePopup',
                    handler: data => {
                      localStorage.clear();
                      this.navCtrl.setRoot(LoginPage);
                      this.platform.exitApp();
                    }
                  }
                ]
              });

              prompt.present();

            }
            else {

              this.global.ToastShow("Failed, please try again later");

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
    else {

      this.global.ToastShow("Please enter Mobile number");

    }

  }

  CurrentLocationClick() {

    if (this.global.CheckInternetConnection()) {

      let that = this;

      this.global.LoadingShow("Please wait...");

      this.geolocation.getCurrentPosition().then((resp) => {

        console.log(resp);

        that.httpClient.get<any>("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + resp.coords.latitude + "," + resp.coords.longitude + "&key=AIzaSyALqrc_I-5AIRWlmU9XH_13ZsuROsaBzjo").subscribe(locationData => {

          console.log(locationData);

          if (locationData != null) {

            for (var i = 0; i < locationData.results[0].address_components.length; i++) {

              if (locationData.results[0].address_components[i].types[0] == "locality") {

                this.location = "City: " + locationData.results[0].address_components[i].long_name;

              }

              if (locationData.results[0].address_components[i].types[0] == "administrative_area_level_1") {

                this.location = this.location + ", State: " + locationData.results[0].address_components[i].long_name;

              }

            }

          }
          else {
            this.global.ToastShow('Error getting location');
          }

          this.global.LoadingHide();

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }).catch((err) => {
        console.log(err);
        this.global.ToastShow('Error getting location ' + err);
        this.global.LoadingHide();
      });

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }


  }

}