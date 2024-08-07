import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { MachinesupdatePage } from '../machinesupdate/machinesupdate';
import { GlobalProvider } from '../../../providers/global/global';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-machinesupdatelist',
  templateUrl: 'machinesupdatelist.html',
})
export class MachinesupdatelistPage {

  MachineDetailsList: any = [];
  MachineDetailsListCopy: any = [];
  MLSrchText: string;
  Notfoundmsg: boolean = false;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {
  }

  ngOnInit() {

    this.global.LoadingShow("Please wait...");

    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/ReadAllProducts?Party_ID=" + this.global.PartyId + "&SearchKey=", {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {

      console.log(val);

      this.MachineDetailsList = val;

      this.MachineDetailsListCopy = Object.assign([], val);

      this.global.LoadingHide();

      if (val.length == 0) {
        this.Notfoundmsg = true;
      } else {
        this.Notfoundmsg = false;
      }

    });

  }


  DetailsModelClose() {
    this.viewCtrl.dismiss();
    //this.navCtrl.setRoot(HomePage);
  }

  MachinesListCount() {

    this.MachineDetailsList = this.MachineDetailsListCopy.filter(p => p.Product_SerialNumber.toLowerCase().trim().includes(this.MLSrchText.toLowerCase().trim())
      || p.ModelData.toLowerCase().trim().includes(this.MLSrchText.toLowerCase().trim())
      || p.ProductTypeData.toLowerCase().trim().includes(this.MLSrchText.toLowerCase().trim()));
    console.log(this.MachineDetailsList);

    // console.log(this.global.HostedPath + "api/ProductMasterAPI/ReadAllProducts?Party_ID=" + this.global.PartyId + "&SearchKey=" + this.MLSrchText);
    // this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/ReadAllProducts?Party_ID=" + this.global.PartyId + "&SearchKey=" + this.MLSrchText, {
    //   headers: this.global.ApiReadHeaders
    // }).subscribe(val => {
    //   console.log(val);
    //   this.MachineDetailsList = val;
    //   console.log(this.MachineDetailsList);
    //   if (val.length == 0) {
    //     this.Notfoundmsg = true;
    //   } else {
    //     this.Notfoundmsg = false;
    //   }
    // })

  }

  SelectedMachine(val) {

    console.log(val);

    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/ReadProduct?Product_ID=" + val.Product_ID, {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {

      console.log(val);
      this.global.MachineDetailsList = val;
      this.navCtrl.setRoot(MachinesupdatePage);
      this.global.seg = "machine";

    })

    // const modal = this.modalCtrl.create(MachinesupdatePage, { data: val });
    // console.log(this.global.seg);
    // modal.present();

  }

}
