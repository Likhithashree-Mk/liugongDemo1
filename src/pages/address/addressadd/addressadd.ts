import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { MachinesupdatePage } from '../../machines/machinesupdate/machinesupdate';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the AddressaddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addressadd',
  templateUrl: 'addressadd.html',
})
export class AddressaddPage {

  SiteAddress = "";
  Location = "";
  SelectedState = "Select";
  Country = "";
  Region = "";
  MachineShiftedDate = null;
  MachineShiftedTime = null;
  IsAddressActive: boolean = false;
  IsMandatory: boolean = false;
  IsDisabled:boolean= true;
  StateList:any;
  CountryId:number;
  StateId:number;
  RegionId:number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient:HttpClient,
    public viewCtrl:ViewController) {
    this.global.HeaderTitle = "Add site Address";
  }

  ngOnInit() {
    //Statelist
    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetStateList", {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {
      console.log(val);
      this.StateList = val;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressaddPage');
  }


  BackToPage() {
    this.navCtrl.setRoot(MachinesupdatePage);
    this.global.seg = "site";
  }

  StateChange(){
    console.log(this.SelectedState);
    //Country list
    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetCountryNames?State_ID="+this.SelectedState, {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {
      console.log(val);
      this.Country= val.countryname
      this.Region= val.RegionName
      this.CountryId = val.countryid
      this.RegionId = val.RegionID

      console.log(this.CountryId)
      console.log(this.StateId)
      console.log(this.RegionId)

    })

  }

  ShiftedDateChange(){
    console.log(this.MachineShiftedDate);
  }

  MachineShiftedTimeChange(){
    console.log(this.MachineShiftedTime)
  }

  CheckboxChange(){
    console.log(this.IsAddressActive);
    if(this.IsAddressActive == true){
      this.IsMandatory = true;
      this.IsDisabled = false;
    }else{
      this.IsMandatory = false;
      this.MachineShiftedDate = null;
      this.MachineShiftedTime = null;
      this.IsDisabled = true;
    }
  }

  Save() {
    console.log(this.SiteAddress)
    console.log(this.Location);
    console.log(this.SelectedState);
    console.log(this.Country);
    console.log(this.Region);
    console.log(this.MachineShiftedDate);
    var data;

    if(this.SiteAddress == "" || this.Location == "" || this.SelectedState == "Select"){
      this.global.ToastShow("Please enter mandatory (*) fields");
    }
    // else if(this.IsAddressActive == true && this.MachineShiftedDate== null){
    //   this.global.ToastShow("Please enter mandatory (*) fields");
    // }
    else{
      data = {
        ProductSiteAddress_ID:'0',
        Product_ID:this.global.MachineDetailsList.Product_ID,
        ProductSiteAddress_SiteAddress:encodeURIComponent(this.SiteAddress),
        ProductSiteAddress_Location:this.Location,
        State_ID: this.SelectedState,
        Country_ID: this.CountryId,
        Region_ID: this.RegionId,
        ProductSiteAddress_IsActive:this.IsAddressActive
      }

      console.log(data);
      this.global.LoadingShow("Please wait...");
      this.httpClient.get<any>(this.global.HostedPath+"api/ProductMasterAPI/InsertSiteAddress?MobileNumber="+this.global.MobileNumber+"&Party_ID="+this.global.PartyId+"&data="+
      JSON.stringify(data), {
        headers: this.global.ApiInsertHeaders
      }).subscribe(val => {
        console.log(val);
        if(val.ID == 0){
          this.global.LoadingHide();
          this.global.ToastShow("something went wrong, please try again.");
        }
        else{
          this.global.LoadingHide();
          this.global.ToastShow("New address added succesfully!");
          this.navCtrl.setRoot(MachinesupdatePage)
        }
      })
    }
  }

}
