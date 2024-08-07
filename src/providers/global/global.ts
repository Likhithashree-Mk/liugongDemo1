import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

@Injectable()
export class GlobalProvider {

  load: any;

  HeaderTitle: string = "Home";

  sidemenushow: boolean = true;

  FeedbackList: any = [];

  UserDetails: any = [];

  RatingReasonData: any = [];

  LocalUser: Boolean = false;

  IsAlertOpen: boolean = false;

  //Rajesh
  SelectedContactList: any = [];
  SelectedSiteAddressList: any = [];
  seg: string = "machine";
  MachineDetailsList: any;
  SiteAddressList: any = [];
  NewSiteAddress: any = [];

  MobileNumber = "";
  PartyId = "";

  ApiReadHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': '12345Read'
  });

  ApiInsertHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': '12345Insert'
  });

  ApiUpdatetHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': '12345Update'
  });

  // public HostedPath = "https://namptest.hcltechswnp.com/MyLiugong_LiveRep/"; 
  // public HostedPath = "https://namptest.hcltechswnp.com/ERP_Liugong/";
  public HostedPath = "http://103.148.165.73/MyLiugong_UAT/"; 
  //public HostedPath = "http://103.148.165.73/Liugong_StagingUAT/"; 
  //public HostedPath = "http://localhost/Liugong/"; 
  //public HostedPath = "http://localhost:59520/"; 
  //public HostedPath = "https://dms.liugongindia.com/MyLiugong/";

  constructor(public http: HttpClient,
    public toastCtrl: ToastController,
    public network: Network,
    public loadingCtrl: LoadingController) {

  }

  public ToastShow(message: string): any {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();

  }

  public ValidateInputControles(pattern: string, value: string): boolean {

    let reg = new RegExp(pattern);

    let result = reg.test(value);

    if (!result) {

      return false;

    }
    else {

      return true;

    }

  }

  public LoadingShow(val: string) {

    this.load = this.loadingCtrl.create({
      content: val
    });

    this.load.present();

  }

  public LoadingHide() {

    this.load.dismiss();

  }

  public CheckInternetConnection(): boolean {

    if (this.network.type != "none") {
      return true;
    }
    else {
      return false;
    }

  }


}
