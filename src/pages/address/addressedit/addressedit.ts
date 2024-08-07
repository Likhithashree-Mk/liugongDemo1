import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { MachinesupdatePage } from '../../machines/machinesupdate/machinesupdate';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-addressedit',
  templateUrl: 'addressedit.html',
})
export class AddresseditPage {

  MachineShiftedDate = null;
  MachineShiftedTime = null;
  IsAddressActive: boolean = false;
  // IsAddressActive= "No";
  IsMandatory: boolean = false;
  IsDisabled: boolean = true;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Update Site Address";

  }

  ngOnInit() {

    if (this.global.SelectedSiteAddressList.ProductSiteAddress_IsActive == "Yes") {
      this.IsAddressActive = true;
    }
    //ion-Date format YYYY-MM-DD
    this.global.SelectedSiteAddressList.MachineShiftedDate;

  }

  BackToPage() {
    this.navCtrl.setRoot(MachinesupdatePage);
    this.global.seg = "site";
  }

  ShiftedDateChange() {
    console.log(this.MachineShiftedDate);
  }

  MachineShiftedTimeChange() {
    console.log(this.MachineShiftedTime);
  }

  CheckboxChange(val) {
    console.log(this.IsAddressActive);
    if (this.IsAddressActive == true) {
      this.IsMandatory = true;
      this.IsDisabled = false;
    } else {
      this.IsMandatory = false;
      this.MachineShiftedDate = null;
      this.MachineShiftedTime = null;
      this.IsDisabled = true;
    }
  }

  Save() {
   
    var data;

    //Checking Mandatory
    if (this.global.SelectedSiteAddressList.ProductSiteAddress_SiteAddress == "" || this.global.SelectedSiteAddressList.ProductSiteAddress_Location == "" || this.global.SelectedSiteAddressList.State_Name == "Select") {
      this.global.ToastShow("Please enter mandatory (*) fields");
    }
    // else if(this.IsAddressActive == "Yes" && this.global.SelectedSiteAddressList.MachineShiftedDate == null){
    //   this.global.ToastShow("Please enter mandatory (*) fields");
    // }
    else {
      this.global.SiteAddressList.forEach(e => {
        if (e.ProductSiteAddress_ID == this.global.SelectedSiteAddressList.ProductSiteAddress_ID) {
          data = {
            ProductSiteAddress_ID: this.global.SelectedSiteAddressList.ProductSiteAddress_ID,
            Product_ID: this.global.MachineDetailsList.Product_ID,
            ProductSiteAddress_SiteAddress: encodeURIComponent(this.global.SelectedSiteAddressList.ProductSiteAddress_SiteAddress),
            ProductSiteAddress_Location: this.global.SelectedSiteAddressList.ProductSiteAddress_Location,
            State_ID: this.global.SelectedSiteAddressList.State_ID,
            Country_ID: this.global.SelectedSiteAddressList.Country_ID,
            Region_ID: this.global.SelectedSiteAddressList.Region_ID,
            ProductSiteAddress_IsActive: this.IsAddressActive
          }
        }
      });

      console.log(data);

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/InsertSiteAddress?MobileNumber=" + this.global.MobileNumber + "&Party_ID=" + this.global.PartyId + "&data=" +
        JSON.stringify(data), {
        headers: this.global.ApiInsertHeaders
      }).subscribe(val => {

        console.log(val);
        if (val.ID == 0) {
          this.global.LoadingHide();
          this.global.ToastShow("something went wrong, please try again.");
        }
        else {
          this.global.LoadingHide();
          this.global.ToastShow("Updated succesfully!");
          this.navCtrl.setRoot(MachinesupdatePage);
        }
        
      });

    }

    console.log(this.global.SiteAddressList);

  }

}
