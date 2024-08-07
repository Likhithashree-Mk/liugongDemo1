import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';
import { DisplaymachinedetailsPage } from '../displaymachinedetails/displaymachinedetails';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  SelectedProduct: any;
  JCAttachments: boolean = true;
  SelectedProductDetails: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpClient: HttpClient,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public modalCtrl: ModalController) {

    this.SelectedProduct = this.navParams.get("data");

    console.log(this.SelectedProduct);

  }

  ngOnInit() {

    this.global.LoadingShow("Please wait...");

    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetProductDetailsForCustomer?ProductID=" + this.SelectedProduct.Product_ID, {
      headers: this.global.ApiReadHeaders
    }).subscribe(machinesDetailsData => {

      console.log(machinesDetailsData);

      this.SelectedProductDetails = machinesDetailsData;

      this.global.LoadingHide();

    }, error => {

      console.log(error);
      this.global.LoadingHide();

    });

  }

  SelectedProductDetailsClick(val) {

    console.log(val);

    const modal = this.modalCtrl.create(DisplaymachinedetailsPage, { data: val });
    modal.present();

  }

  DetailsModelClose() {

    this.viewCtrl.dismiss();

  }

  // AttachmentView(Attachment) {

  //   window.open(this.global.HostedPath + "JobCard_Attachments/" + Attachment.FileName, "_system");

  // }

}
