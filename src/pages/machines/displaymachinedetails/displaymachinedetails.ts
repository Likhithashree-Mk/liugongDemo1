import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-displaymachinedetails',
  templateUrl: 'displaymachinedetails.html',
})

export class DisplaymachinedetailsPage {

  details: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.details = this.navParams.get('data');

  }

  DetailsModelClose() {

    this.viewCtrl.dismiss();

  }


  AttachmentView(Attachment) {

    window.open(this.global.HostedPath + "Attachments/169-" + Attachment.JobCard_ID + "-" + Attachment.FileName, "_system");

  }

  PDFView(val) {

    console.log(val);

    //window.open(this.global.HostedPath + val.JCPath, "_system");

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetJobCardPDFPathAPI?JobCardID=" + val.JobCardID, {
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

}
