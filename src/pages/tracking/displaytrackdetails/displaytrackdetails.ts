import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { TicketstatushistoryPage } from '../ticketstatushistory/ticketstatushistory';
import { JcstatushistoryPage } from '../jcstatushistory/jcstatushistory';

@IonicPage()
@Component({
  selector: 'page-displaytrackdetails',
  templateUrl: 'displaytrackdetails.html',
})
export class DisplaytrackdetailsPage {

  SelectedSR: any;
  TickectStatusList: any = [];
  JCStatusList: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public modalCtrl: ModalController,
    public httpClient: HttpClient) {

    this.SelectedSR = this.navParams.get('data');

    console.log(this.SelectedSR);

  }

  ngOnInit() {

    this.global.LoadingShow("Please wait...");

    this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/SelectNotesDetails?SRIDGlobal=" + this.SelectedSR.ServiceRequest_ID + "&userLanguageID=1&generalLanguageID=1&UserCulture=en&User_ID=" + this.SelectedSR.User_ID, {
      headers: this.global.ApiReadHeaders
    }).subscribe(trackingDetailsData => {

      console.log(trackingDetailsData);

      this.TickectStatusList = trackingDetailsData;

      if (this.SelectedSR.JobCardID != 0) {

        this.httpClient.get<any>(this.global.HostedPath + "api/JobCardAPI/SelAllJCActivity?JobCard_ID=" + + this.SelectedSR.JobCardID + "&userLanguageID=1&generalLanguageID=1", {
          headers: this.global.ApiReadHeaders
        }).subscribe(jcStatusList => {

          console.log(jcStatusList);

          this.JCStatusList = jcStatusList;

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }

      this.global.LoadingHide();

    }, error => {

      console.log(error);
      this.global.LoadingHide();

    });

  }

  DetailsModelClose() {

    this.viewCtrl.dismiss();

  }

  PDFViewer(JobCardID) {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetJobCardPDFPathAPI?JobCardID=" + JobCardID, {
        headers: this.global.ApiReadHeaders
      }).subscribe(jobCardPdfData => {

        console.log(jobCardPdfData);

        if (jobCardPdfData[1].Value == "Closed" && jobCardPdfData[1].Value != "Cancelled") {

          window.open(this.global.HostedPath + jobCardPdfData[0].Value, "_system");

        } else {

          this.global.ToastShow("JobCard is not closed. Cannot display pdf");

        }

        this.global.LoadingHide();

      }, error => {

        console.log(error);
        this.global.LoadingHide();

      });

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  TicketShowmoreClick() {
    const modal = this.modalCtrl.create(TicketstatushistoryPage, { data: this.TickectStatusList });
    modal.present();
  }

  JcShowmoreClick() {
    const modal = this.modalCtrl.create(JcstatushistoryPage, { data: this.JCStatusList });
    modal.present();
  }

}
