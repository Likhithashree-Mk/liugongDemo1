import { Component, OnInit } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { DisplaytrackdetailsPage } from './displaytrackdetails/displaytrackdetails';

@IonicPage()
@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html',
})

export class TrackingPage implements OnInit {

  MessageDisplay: string = "Getting records Ready";
  SRSearchText: string = "";

  SRList: any = [];
  FinalSRList: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient,
    public modalCtrl: ModalController) {

    this.global.HeaderTitle = "Track Your Request";

  }

  ngOnInit() {

    this.global.LoadingShow("Please wait...");

    this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetStatusofOpenIssues?MobileNumber=" + this.global.UserDetails[0].MobileNumner + "&Party_ID=" + this.global.UserDetails[0].Party, {
      headers: this.global.ApiReadHeaders
    }).subscribe(trackingDetailsData => {

      console.log(trackingDetailsData);

      this.SRList = trackingDetailsData;

      this.FinalSRList = Object.assign([], trackingDetailsData);

      this.global.LoadingHide();

    }, error => {

      console.log(error);
      this.global.LoadingHide();

    });

  }

  SRClick(SR) {

    const modal = this.modalCtrl.create(DisplaytrackdetailsPage, { data: SR });
    modal.present();

  }

  PDFViewer(JobCardID) {

    //   if (this.global.CheckInternetConnection()) {

    //     this.global.LoadingShow("Please wait...");

    //     this.httpClient.get<any>(this.global.HostedPath + "api/JobCardAPI/GetJobCardPDFPathAPI?JobCardID=" + JobCardID, {
    //       headers: this.global.ApiReadHeaders
    //     }).subscribe(jobCardPdfData => {

    //       console.log(jobCardPdfData);

    //       if (jobCardPdfData[1].Value == "Closed") {

    //         this.global.ToastShow("JobCard is closed. Cannot display pdf");

    //       } else {

    //         window.open("https://servicecrm.wirtgenindia.com/fsm" + jobCardPdfData[0].Value, "_system");

    //       }

    //       this.global.LoadingHide();

    //     }, error => {

    //       console.log(error);
    //       this.global.LoadingHide();

    //     });

    //   }
    //   else {
    //     this.global.ToastShow("Please check your internet connection");
    //   }

  }

  SRSearch(val) {

    this.FinalSRList = this.SRList.filter(p => p.ServiceRequestNumber.toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.CallDescription.toLowerCase().trim().includes(val.toLowerCase().trim())
      || p.Status.toLowerCase().trim().includes(val.toLowerCase().trim())
      //|| p.ServiceRequestDate.toLowerCase().trim().includes(val.toLowerCase().trim())
      //|| p.Caseowner.toLowerCase().trim().includes(val.toLowerCase().trim())
      //|| (p.Contatctno != null ? p.Contatctno.toLowerCase().trim().includes(val.toLowerCase().trim()) : "")
    );

    console.log(this.FinalSRList);

    if (this.FinalSRList == 0) {
      this.MessageDisplay = "No records found, try different values";
    }
    else {
      this.MessageDisplay = "Getting records Ready";
    }

  }

  PageRefresh(refresher) {

    //this.global.LoadingShow("Please wait...");

    this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetStatusofOpenIssues?MobileNumber=" + this.global.UserDetails[0].MobileNumner + "&Party_ID=" + this.global.UserDetails[0].Party, {
      headers: this.global.ApiReadHeaders
    }).subscribe(trackingDetailsData => {

      console.log(trackingDetailsData);

      this.SRList = trackingDetailsData;

      this.FinalSRList = Object.assign([], trackingDetailsData);

      //this.global.LoadingHide();
      this.SRSearchText = "";

      refresher.complete();

    }, error => {

      console.log(error);
      //this.global.LoadingHide();

    });

  }

}
