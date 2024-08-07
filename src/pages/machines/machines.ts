import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { DetailsPage } from '../../pages/machines/details/details';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-machines',
  templateUrl: 'machines.html',
})

export class MachinesPage implements OnInit {

  MachinListSeartcText: string;
  MachinesListCopy: any = [];
  FinalMachineDetailsList = [];
  selectedCustomerID = -1;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Machine Details";
    this.global.sidemenushow = true;

  }

  ngOnInit() {

    if (!this.global.LocalUser) {

      if (this.global.UserDetails.length == 1) {

        this.global.LoadingShow("Please wait...");

        this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetProductHeaderDetails?PartyID=" + this.global.UserDetails[0].Party, {
          headers: this.global.ApiReadHeaders
        }).subscribe(machinesListData => {

          console.log(machinesListData);

          if (machinesListData != null) {

            this.FinalMachineDetailsList = machinesListData;

            this.MachinesListCopy = Object.assign([], machinesListData);

          }

          this.global.LoadingHide();

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }

    } else {

      this.FinalMachineDetailsList = [{
        "ProductID": 9667,
        "UniqueIdentifier": "H218.1342",
        "SerialNumber": "H218.1342",
        "ModelName": "HD 99 VV",
        "Brand": "Hamm",
        "ProductType": "TANDEM ROLLER",
        "CurrentReading": 0,
        "CurrentStatus": null,
        "CustomerName": null,
        "SiteAddress": null,
        "Reference_Date": null,
        "WarrantyDetails": false,
        "CustomerDetails": false,
        "ServiceHistoryDetails": false,
        "ComponentDetails": false,
        "ProductReadingDetails": false,
        "ProductStatusHistoryDetails": false,
        "Location": null,
        "StateID": null,
        "CountryID": null,
        "RegionID": null,
        "State": null,
        "Country": null,
        "Region": null,
        "CommissioningDate": null,
        "CommissioningDate_Sort": null,
        "Operator_ID": null,
        "ContactOperators": null,
        "OperatorPhone": null,
        "OperatorEmail": null,
        "OperatorName": null,
        "Party_ID": 0,
        "Machine_ShiftedDateSort": null,
        "Machine_ShiftedDate": null,
        "EngineSerialNo": null,
        "ManufactureYear": 0,
        "NextServiceType": null,
        "NextServiceDate": null,
        "WarrantyType": null,
        "IsUnderWarranty": false,
        "JobCardCount": null
      }]
      this.MachinesListCopy = Object.assign([], this.FinalMachineDetailsList);

    }

  }

  SelectedMachine(val) {

    const modal = this.modalCtrl.create(DetailsPage, { data: val });
    modal.present();

  }

  MachinesListCount() {

    this.FinalMachineDetailsList = this.MachinesListCopy.filter(p => p.Product_SerialNumber.toLowerCase().trim().includes(this.MachinListSeartcText.toLowerCase().trim())
      || p.BrandData.toLowerCase().trim().includes(this.MachinListSeartcText.toLowerCase().trim())
      || p.ModelData.toLowerCase().trim().includes(this.MachinListSeartcText.toLowerCase().trim()));

    console.log(this.FinalMachineDetailsList);

  }

  PartyChange(ele) {

    if (this.global.CheckInternetConnection()) {

      //let selectedCustomerID = ele.target.options[ele.target.options.selectedIndex].value;

      this.global.LoadingShow("Please wait...");

      if (this.selectedCustomerID != -1) {

        this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetProductHeaderDetails?PartyID=" + this.selectedCustomerID, {
          headers: this.global.ApiReadHeaders
        }).subscribe(machinesListData => {

          console.log(machinesListData);

          if (machinesListData != null) {

            this.FinalMachineDetailsList = machinesListData;

            this.MachinesListCopy = Object.assign([], machinesListData);

          }

          this.global.LoadingHide();

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }
      else {

        this.FinalMachineDetailsList = [];
        this.global.LoadingHide();

      }

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

}
