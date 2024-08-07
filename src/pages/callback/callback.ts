import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-callback',
  templateUrl: 'callback.html',
})

export class CallbackPage {

  CallbackDateDisable: boolean = true;

  TodaysDate: string;
  TodaysTime: string;

  CallBackDate: string = "";
  CallBackTime: string = "";

  PartyID: string = "0";
  CompanyID: string = "0";

  CallBackValues: string = "1";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public httpClient: HttpClient,
    public global: GlobalProvider) {

    this.global.HeaderTitle = "Request Call Back";
    this.global.sidemenushow = true;

    let date = new Date();

    let month = ((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    let day = (date.getDate() > 9) ? (date.getDate()) : "0" + (date.getDate());
    this.TodaysDate = date.getFullYear() + "-" + month + "-" + day;

    let hours = (date.getHours() > 9) ? date.getHours() : "0" + date.getHours();
    let minuts = (date.getMinutes() > 9) ? date.getMinutes() : "0" + date.getMinutes();
    this.TodaysTime = hours + ":" + minuts;

    console.log(this.TodaysTime);

    if (this.global.UserDetails.length == 1) {

      this.PartyID = this.global.UserDetails[0].Party;
      this.CompanyID = this.global.UserDetails[0].ComapnyID;

    }

  }

  CallbackChange(val: string) {

    if (val == "4") {
      this.CallbackDateDisable = false;
    }
    else {
      this.CallBackDate = "";
      this.CallBackTime = "";
      this.CallbackDateDisable = true;
    }

  }

  CallbackSubmitClick() {

    if (this.global.CheckInternetConnection()) {

      let CallDescription;
      let CallBackRequestedDate = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear();
      let ChoosedTime;

      if (this.PartyID != "0") {

        switch (this.CallBackValues) {

          case "1":
            CallDescription = "Call Back Within 10 mins";
            ChoosedTime = 10;
            break;

          case "2":
            CallDescription = "Call Back Within 30 mins";
            ChoosedTime = 30;
            break;

          case "3":
            CallDescription = "Call Back Within 1 hour";
            ChoosedTime = 60;
            break;

          case "4":

            let d = new Date(this.CallBackDate).toString().split(" ");

            let date = d[2] + "-" + d[1] + "-" + d[3];

            CallDescription = "Call Back Date & Time " + date + " " + this.CallBackTime;

            break;

          default:
            break;

        }

        if (this.CallBackValues == "4") {

          if (this.CallBackDate != "" && this.CallBackTime != "") {

            let todaysTime = new Date().getTime();
            let givenTime = new Date(this.CallBackDate + "T" + this.CallBackTime).getTime();

            console.log(todaysTime);
            console.log(givenTime);

            if (givenTime > todaysTime) {

              this.global.LoadingShow("Please wait...");

              let weekday = new Array(7);
              weekday[0] = "Sunday";
              weekday[1] = "Monday";
              weekday[2] = "Tuesday";
              weekday[3] = "Wednesday";
              weekday[4] = "Thursday";
              weekday[5] = "Friday";
              weekday[6] = "Saturday";

              var sptdate = this.CallBackDate.toString().split("-");
              var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              let Month = sptdate[1];
              var Day = sptdate[2];
              var Year = sptdate[0];
              let FormattedDate = Day + "-" + months[Number(Month) - 1] + "-" + Year;

              var spttime = this.CallBackTime.toString().split(':');
              var hours = spttime[0];
              var minutes = spttime[1];
              var newdate;
              var chosedoption;

              newdate = new Date(Number(Year), (Number(Month) - 1), Number(Day), Number(hours), Number(minutes));

              newdate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });

              chosedoption = "Date & Time " + FormattedDate + ' ' + newdate.getHours() + ":" + (newdate.getMinutes() < 10 ? '0' + newdate.getMinutes() : +newdate.getMinutes().toString());

              var choosedweek = newdate.getDay();

              this.httpClient.post<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/CreateTicketAPI?MobileNumber=" + this.global.UserDetails[0].MobileNumner + "&DateTime=" + CallBackRequestedDate + "&ProductReading=0&CallDescription=" + encodeURIComponent(CallDescription) + "&Party_ID=" + this.global.UserDetails[0].Party + "&Company_ID=1&ReloginView=" + this.global.HostedPath + "&SerialNumber=&IsBreakdown=true", null, {
                headers: this.global.ApiInsertHeaders
              }).subscribe(verificationQueueData => {

                console.log(verificationQueueData);

                if (verificationQueueData[1].Value == "Success") {

                  this.global.LoadingHide();

                  if (weekday[choosedweek] == "Sunday") {
                    this.global.ToastShow("Request is registered,will get back to you on working days");
                  }
                  else if (newdate.getHours() <= 7 && newdate.getMinutes() <= 30) {
                    this.global.ToastShow("Request is registered,will get back to you as earliest");
                  }
                  else if (newdate.getHours() >= 22) {
                    if (weekday[choosedweek] != "Saturday") {
                      this.global.ToastShow("Request is registered,will get back to you tomorrow");
                    }
                    else {
                      this.global.ToastShow("Request is registered,will get back to you on working days");
                    }
                  }
                  else {
                    //this.global.ToastShow("Request is registered Successfully");
                    this.TicketRegisteredPopup();
                  }

                }
                else {

                  this.global.ToastShow("Could not register request,please register again");
                  this.navCtrl.setRoot(HomePage);

                }

              }, error => {

                console.log(error);
                this.global.LoadingHide();

              });

            }
            else {

              this.global.ToastShow("Selected Time should be greater than current time");

            }

          }
          else {

            this.global.ToastShow("Please select both Date & Time");

          }

        }
        else {

          this.global.LoadingShow("Please wait...");

          let weekday = new Array(7);
          weekday[0] = "Sunday";
          weekday[1] = "Monday";
          weekday[2] = "Tuesday";
          weekday[3] = "Wednesday";
          weekday[4] = "Thursday";
          weekday[5] = "Friday";
          weekday[6] = "Saturday";

          ChoosedTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })

          var CurrentDate = new Date();
          CurrentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });

          var twentyMinutesLater = new Date();
          twentyMinutesLater.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
          twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + ChoosedTime);

          var GetCurrentWeek = CurrentDate.getDay();

          this.httpClient.post<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/CreateTicketAPI?MobileNumber=" + this.global.UserDetails[0].MobileNumner + "&DateTime=" + CallBackRequestedDate + "&ProductReading=0&CallDescription=" + encodeURIComponent(CallDescription) + "&Party_ID=" + this.global.UserDetails[0].Party + "&Company_ID=1&ReloginView=" + this.global.HostedPath + "&SerialNumber=&IsBreakdown=true", null, {
            headers: this.global.ApiInsertHeaders
          }).subscribe(verificationQueueData => {

            console.log(verificationQueueData);

            if (verificationQueueData[1].Value == "Success") {

              this.global.LoadingHide();

              if (weekday[GetCurrentWeek] == "Sunday") {
                this.global.ToastShow("Request is registered,will get back to you on working days");
              }
              else if (twentyMinutesLater.getHours() <= 7 && twentyMinutesLater.getMinutes() <= 30) {
                this.global.ToastShow("Request is registered,will get back to you as earliest");
              }
              else if (twentyMinutesLater.getHours() >= 22) {
                if (weekday[GetCurrentWeek] != "Saturday") {
                  this.global.ToastShow("Request is registered,will get back to you tomorrow");
                }
                else {
                  this.global.ToastShow("Request is registered,will get back to you on working days");
                }
              }
              else {
                //this.global.ToastShow("Request is registered Successfully");
                this.TicketRegisteredPopup();
              }

            }
            else {

              this.global.ToastShow("Could not register request,please register again");
              this.navCtrl.setRoot(HomePage);

            }

          }, error => {

            console.log(error);
            this.global.LoadingHide();

          });

        }

      }
      else {

        this.global.ToastShow("Please select the Customer");

      }

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  CallbackCancelClick() {
    this.navCtrl.setRoot(HomePage);
  }

  PartyChange(ele) {

    let selectedParty = ele.target.options[ele.target.options.selectedIndex].value;

    if (selectedParty != "-1") {

      this.PartyID = selectedParty;
      this.CompanyID = this.global.UserDetails.filter(p => p.Party == this.PartyID)[0].ComapnyID;

    }
    else {

      this.PartyID = "0";
      this.CompanyID = "0"

    }

  }

  TicketRegisteredPopup() {

    this.global.IsAlertOpen = true;

    let Alert1 = this.alertCtrl.create({
      subTitle: '<b>Message</b>',
      message: 'Dear Customer your Complaint has been registered in case of further inquiry you will get a call from 18001033852 please receive and revert',
      buttons: [
        {
          text: 'OK',
          cssClass: 'BtnOnePopup',
          handler: data => {

            this.global.IsAlertOpen = false;
            this.navCtrl.setRoot(HomePage);

          }
        }
      ],
      enableBackdropDismiss: false
    });

    Alert1.present();


  }

}