import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { MachinesupdatelistPage } from '../machinesupdatelist/machinesupdatelist';
import { AddresseditPage } from '../../address/addressedit/addressedit';
import { AddressaddPage } from '../../address/addressadd/addressadd';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-machinesupdate',
  templateUrl: 'machinesupdate.html',
})
export class MachinesupdatePage {

  // global.MachineDetailsList:any;
  // SiteAddressList = [];
  SiteAddressListCopy: any = [];
  CurrentTime: any;
  CurrentDate: any;
  CurrentStatusTime: any;
  CurrentStatusDate: any;
  CurrentSegmentTime: any;
  CurrentSegmentDate: any
  AddSrchText: string = "";
  StatusList: any;
  SelectedMachine: any;
  SelectedStatus = "";
  enteredhmr: any;
  hmrvalidateformatdate: any;
  SegmentList: any;
  SelectedPriSeg: "";
  SelectedSecSeg: "";
  SecSegmentList: any;
  statusformatdate: any;
  WarrantyList: any;
  EnableMandatory: boolean = false;
  EnableStatusLabelMandatory: boolean = false;
  EnableSecSeglMandatory: boolean = false;
  Maxdate:any;
  DisplayHMRDateformat:any;
  DisplayStatusDateformat:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Machine Update";
    this.Maxdate = new Date().toISOString();
    console.log(this.Maxdate);

    // this.CurrentTime = this.getCurrentTime();
    // this.CurrentStatusTime = this.getCurrentTime();
    // this.CurrentSegmentTime = this.getCurrentTime();
    // console.log(this.CurrentTime);

  }



  ngOnInit() {

    //calling updated Product
    this.CallProductAPI();

    //Status List
    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/GetProductMachineStatus", {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {

      this.StatusList = val;

      console.log(this.StatusList);

      if (this.StatusList.length > 0) {
        //Address List
        console.log(this.global.MachineDetailsList.Product_ID);
        this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/ReadProductSiteAddress?ProductID=" + this.global.MachineDetailsList.Product_ID, {
          headers: this.global.ApiReadHeaders
        }).subscribe(val => {
          this.global.SiteAddressList = val;
          // this.global.SiteAddressList.sort((a, b) => new Date(b.ModifiedDatetime).getTime() - new Date(a.ModifiedDatetime).getTime());
          this.global.SiteAddressList.sort((b, a) => a.ProductSiteAddress_IsActive > b.ProductSiteAddress_IsActive);
          console.log(this.global.SiteAddressList);
          if (this.global.SiteAddressList.length > 0) {
            //Segment List
            this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/SelPrimarySegment", {
              headers: this.global.ApiReadHeaders
            }).subscribe(val => {
              this.SegmentList = val;
              console.log(this.SegmentList);
              if (this.SegmentList.length > 0) {
                //Warranty List
                this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/ReadProductWarrantyDetails?ProductID=" + this.global.MachineDetailsList.Product_ID, {
                  headers: this.global.ApiReadHeaders
                }).subscribe(val => {
                  this.WarrantyList = val;
                  this.WarrantyList.sort((b, a) => new Date(b.ProductWarranty_IssueDate).getTime() - new Date(a.ProductWarranty_IssueDate).getTime());
                  console.log(this.WarrantyList);
                })
              }
            })
          }
        })
      }

    });

  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString();
    const minutes = now.getMinutes().toString();
    return `${hours}:${minutes}`;
  }

  DisplayDateFormat(date){
    date = date.split("T");
    let formatedate = date[0]+"  "+date[1];
    return formatedate;
  }

  CallProductAPI() {

    this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/ReadProduct?Product_ID=" + this.global.MachineDetailsList.Product_ID, {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {
      console.log(val);
      this.global.MachineDetailsList = val;
      this.DisplayHMRDateformat = this.DisplayDateFormat(this.global.MachineDetailsList.Reference_Date)
      console.log(this.DisplayHMRDateformat)
      this.DisplayStatusDateformat =this.DisplayDateFormat(this.global.MachineDetailsList.MachineStatusDate)
      console.log(this.DisplayStatusDateformat)
    });

  }

  BackToListPage() {
    this.navCtrl.setRoot(MachinesupdatelistPage);
  }

  CurrentTimeChange() {
    console.log(this.CurrentTime);
    this.EnableMandatory = false;
  }

  CurrentDateChange() {
    console.log(this.CurrentDate);
    var a = this.CurrentDate.split("-");
    var yr = a[0];
    var mnth = a[1];
    var dy = a[2];
    this.hmrvalidateformatdate = mnth + "/" + dy + "/" + yr;
    console.log(this.hmrvalidateformatdate);
  }

  DisplayMandatory() {
    console.log(this.enteredhmr);
    console.log(this.CurrentTime)
    if ((this.enteredhmr != undefined && this.enteredhmr != null && this.enteredhmr != "") && (this.CurrentTime == undefined || this.CurrentDate == undefined)) {
      this.EnableMandatory = true;
    }
    else {
      this.EnableMandatory = false;
    }
    console.log(this.EnableMandatory)
  }

  CurrentStatusDateChange() {
    console.log(this.CurrentStatusDate);
    var a = this.CurrentStatusDate.split("-");
    var yr = a[0];
    var mnth = a[1];
    var dy = a[2];
    this.statusformatdate = mnth + "/" + dy + "/" + yr;
    console.log(this.statusformatdate);
  }

  CurrentStatusTimeChange() {
    console.log(this.CurrentStatusTime);
    this.EnableStatusLabelMandatory = false;
  }

  CurrentSegmentDateChange() {
    console.log(this.CurrentSegmentDate);
  }

  CurrentSegmentTimeChange() {
    console.log(this.CurrentSegmentTime);
  }

  SelectedAddress(val) {
    this.global.SelectedSiteAddressList = val;
    console.log(this.global.SelectedSiteAddressList);
    this.navCtrl.setRoot(AddresseditPage);
  }

  AddressListCount() {

    this.global.SiteAddressList = this.SiteAddressListCopy.filter(p => p.Location.toLowerCase().trim().includes(this.AddSrchText.toLowerCase().trim())
      || p.State.toLowerCase().trim().includes(this.AddSrchText.toLowerCase().trim())
      || p.MachineShiftedDate.toLowerCase().trim().includes(this.AddSrchText.toLowerCase().trim()));

    console.log(this.global.SiteAddressList);
    this.global.SiteAddressList.sort((a, b) => new Date(b.MachineShiftedDate).getTime() - new Date(a.MachineShiftedDate).getTime());

  }

  AddSiteAddress() {
    this.navCtrl.setRoot(AddressaddPage)
  }

  StatusChange() {

    console.log(this.SelectedStatus);
    if ((this.SelectedStatus != undefined && this.SelectedStatus != null && this.SelectedStatus != "") && (this.CurrentStatusDate == undefined || this.CurrentStatusTime == undefined)) {
      this.EnableStatusLabelMandatory = true;
    }
    else {
      this.EnableStatusLabelMandatory = false;
    }
  }

  PriSegChange() {
    console.log(this.SelectedPriSeg);
    if (this.SelectedPriSeg != undefined && this.SelectedPriSeg != null && this.SelectedPriSeg != "") {
      this.EnableSecSeglMandatory = true;
      this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/SelSecondarySegment?PrimarySegmentID=" + this.SelectedPriSeg, {
        headers: this.global.ApiReadHeaders
      }).subscribe(val => {
        console.log(val);
        this.SecSegmentList = val;
      })
    }
    else {
      this.EnableSecSeglMandatory = false;
    }
  }

  SecSegChange() {
    console.log(this.SelectedSecSeg);
    if (this.SelectedSecSeg != undefined && this.SelectedSecSeg != null && this.SelectedSecSeg != "") {
      this.EnableSecSeglMandatory = false;
    }
  }

  SegmentChange(tab) {

    switch (tab) {
      case "machine":
        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
        break;
      case "reading":
        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 50,
          behavior: 'smooth'
        });
        break;
      case "status":
        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 100,
          behavior: 'smooth'
        });
        break;
      case "site":
        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 150,
          behavior: 'smooth'
        });
        break;
      case "warranty":
        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 200,
          behavior: 'smooth'
        });
        break;
      case "msegment":
        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 200,
          behavior: 'smooth'
        });
        break;

      default:
        break;
    }

  }

  SaveReading() {


    console.log(this.DisplayHMRDateformat)
    var checkhmrinsertformatdate = this.CurrentDate+"  "+this.CurrentTime+":00";

    var hmrinsertformatdate = this.CurrentDate + "T" + this.CurrentTime + ":00";
    console.log(this.enteredhmr)
    console.log(this.CurrentTime);
    console.log(this.EnableMandatory);

    if (this.enteredhmr != undefined) {
      if (this.EnableMandatory == true) {
        this.global.ToastShow("Please enter * mandatory fields")
      }
      else {
        console.log(hmrinsertformatdate);
        var insertdata;

        //Checking HMR for 24       
        console.log(this.global.HostedPath + "api/ProductMasterAPI/IsValidMachineReading?Product_ID=" + this.global.MachineDetailsList.Product_ID + "&CurrentReading=" + this.enteredhmr + "&CurrentReadingDate=" + hmrinsertformatdate + "&IsUpdate=true");

        this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/IsValidMachineReading?Product_ID=" + this.global.MachineDetailsList.Product_ID + "&CurrentReading=" + this.enteredhmr + "&CurrentReadingDate=" + hmrinsertformatdate + "&IsUpdate=true", {
          headers: this.global.ApiReadHeaders
        }).subscribe(val => {
          console.log(val);

          if (val == true) {
            if (checkhmrinsertformatdate <= this.DisplayHMRDateformat){
              this.global.ToastShow("Current Details should not be less than Previous Details")
            }
            else if(checkhmrinsertformatdate > this.DisplayHMRDateformat) {
              insertdata = {
                Product_ID: this.global.MachineDetailsList.Product_ID,
                CurrentReading: this.enteredhmr,
                AccumulatedHMR: this.enteredhmr,
                Reference_Date: hmrinsertformatdate,
                Mode: "3"
              }
              console.log(insertdata);
              this.global.LoadingShow("Please wait...");
              console.log(this.global.HostedPath + "api/ProductMasterAPI/InsertProductReadingDetails?Party_ID=" + this.global.PartyId + "&MobileNumber=" + this.global.MobileNumber + "&userLanguageID=1&data=" + JSON.stringify(insertdata))
              
              this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/InsertProductReadingDetails?Party_ID=" + this.global.PartyId + "&MobileNumber=" + this.global.MobileNumber + "&userLanguageID=1&data=" + JSON.stringify(insertdata), {
                headers: this.global.ApiInsertHeaders
              }).subscribe(val => {
                console.log(val);
                this.global.seg = "machine";
                this.navCtrl.setRoot(MachinesupdatePage);
                this.global.ToastShow("Updated Successfully!")
              })
            }

          }
          else {
            this.global.ToastShow("Can Not Update More Than 24 In a Day.")
          }
          this.global.LoadingHide();
        })
      }
    }
    else {
      this.global.ToastShow("Please enter HMR")
    }
  }

  SaveStatus() {
    var statusinsertformatdate = this.CurrentStatusDate + "T" + this.CurrentStatusTime + ":00";

    if (this.SelectedStatus != "") {
      if (this.EnableStatusLabelMandatory == true) {
        this.global.ToastShow("Please enter * mandatory fields")
      }
      else {
        this.global.LoadingShow("Please wait...");

        console.log(this.global.HostedPath + "api/ProductMasterAPI/UpdateProductStatus?Party_ID=" + this.global.PartyId + "&MobileNumber=" + this.global.MobileNumber + "&ProductID=" + this.global.MachineDetailsList.Product_ID + "&Status=" + this.SelectedStatus + "&date=" + statusinsertformatdate + "&Latitude=0&Longitude=0");

        this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/UpdateProductStatus?Party_ID=" + this.global.PartyId + "&MobileNumber=" + this.global.MobileNumber + "&ProductID=" + this.global.MachineDetailsList.Product_ID + "&Status=" + this.SelectedStatus + "&date=" + statusinsertformatdate + "&Latitude=0&Longitude=0", {
          headers: this.global.ApiInsertHeaders
        }).subscribe(val => {
          console.log(val);
          if (val[0].Value == false) {
            this.global.LoadingHide();
            this.global.ToastShow("something went wrong please try again.")
          } else {
            this.global.LoadingHide();
            this.global.seg = "machine";
            this.navCtrl.setRoot(MachinesupdatePage);
            this.global.ToastShow("Updated Successfully")
          }
        })
      }
    }
    else {
      this.global.ToastShow("Please select Machine Status")
    }
  }

  SaveSegment() {

    if (this.SelectedPriSeg != undefined) {
      if (this.EnableSecSeglMandatory == true) {
        this.global.ToastShow("Please enter * mandatory fields")
      }
      else {
        this.global.LoadingShow("Please wait");
        this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/UpdateSegmentProduct?Product_ID=" + this.global.MachineDetailsList.Product_ID + "&PrimarySegmentID=" + this.SelectedPriSeg + "&SecondarySegment=" + this.SelectedSecSeg, {
          headers: this.global.ApiInsertHeaders
        }).subscribe(val => {
          console.log(val);
          if (val == "Saved") {
            this.global.LoadingHide();
            this.global.ToastShow("Updated Successfully");
            this.CallProductAPI();
            this.SelectedPriSeg = "";
            this.SelectedSecSeg = "";
          }
        })
      }
    }
    else {
      this.global.ToastShow("Please select Primary segment.")
    }
  }

  SaveClick() {

    if (this.enteredhmr != undefined && this.enteredhmr != "" ||
      this.hmrvalidateformatdate != undefined ||
      this.SelectedStatus != null ||
      this.statusformatdate != undefined ||
      this.SelectedPriSeg != undefined ||
      this.SelectedSecSeg != undefined) {
      this.global.ToastShow("Call APi")


    }
    else {
      this.global.ToastShow("Please enter data to Save details.")
    }
  }


}