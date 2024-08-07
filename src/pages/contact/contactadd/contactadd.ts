import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { ContactlistPage } from '../contactlist/contactlist';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-contactadd',
  templateUrl: 'contactadd.html',
})

export class ContactaddPage {

  EnteredName: string = "";
  SelectedDepartment = "";
  SelectedDesignation = "";
  EnteredMobile: number;
  EnteredEmail: string = "";
  DefaultValue: boolean = true;
  IsActiveValue: boolean = false;
  EnteredLandline: string = "";
  EnteredRemarks = "";
  validName: boolean = false;
  validMob: boolean = false;
  validEmail: boolean = false;
  validlandline: boolean = false;
  DepartmentList: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Add Contact Person"

  }

  ngOnInit() {
    //Department list
    this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/GetReferenceMasterData?ReferenceMasterName=DEPARTMENT&Company_ID=1&Language_ID=0", {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {
      this.DepartmentList = val;
      console.log(this.DepartmentList);
    })
  }

  BackToPage() {
    this.navCtrl.setRoot(ContactlistPage);
  }

  NameValidation(name) {
    let namepat = /^[A-Za-z ]+$/
    if (!namepat.test(name)) {
      // this.global.ToastShow("Please enter valid Name")
      this.validName = true;
    }
    else {
      this.validName = false;
    }
  }

  MobileValidation(mob) {
    var mobilepattern = /^[5-9]{1}[0-9]{9}$/;
    if (!mobilepattern.test(mob)) {
      // this.global.ToastShow("Please enter valid Mobile number")
      this.validMob = true;
    }
    else {
      this.validMob = false;
    }
  }

  EmailValidation(email) {
    var emailpattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$/;
    if (email != "") {
      if (!emailpattern.test(email)) {
        // this.global.ToastShow("Please enter valid Email ID")
        this.validEmail = true;
      }
      else {
        this.validEmail = false;
      }
    }
    else {
      this.validEmail = false;
    }
  }

  DepartmentChange(val) {
    console.log(val);
  }

  DesignationChange(val) {
    console.log(val);
  }

  DefaultContactChange(val) {
    console.log(val);
  }

  IsActiveChange(val) {
    console.log(val);
  }

  LandlineValidation(val) {

    var landlinepattern = /^[0-9]{5}([- ]*)[0-9]{6}$/;
    if (val != "") {
      if (!landlinepattern.test(val)) {
        // this.global.ToastShow("Please enter valid Landline Number")
        this.validlandline = true;
      }
      else {
        this.validlandline = false;
      }
    }
    else {
      this.validlandline = false;
    }

  }

  Save() {

    var data;

    if (this.EnteredName.trim() == "" || this.EnteredMobile == null) {
      this.global.ToastShow("Please enter mandatory (*) fields");
    }
    else if (this.validName == true || this.validMob == true || this.validEmail == true || this.validlandline == true) {
      this.global.ToastShow("Please enter valid details");
    }
    else {
      //Checking duplicate Mobile num
      this.global.LoadingShow("Please wait");
      this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/checkDuplicateMobileNumber?MobileNumber=" + this.EnteredMobile + "&Party_ID=54&PartyContactPersonID=0", {
        headers: this.global.ApiReadHeaders
      }).subscribe(val => {
        console.log(val);
        if (val == true) {
          this.global.LoadingHide();
          this.global.ToastShow("Mobile number already exist")
        }
        else {
          data = {
            Party_ID: this.global.PartyId,
            PartyContactPerson_ID: 0,
            PartyContactPerson_Name: this.EnteredName,
            PartyContactPerson_Email: this.EnteredEmail,
            PartyContactPerson_Department: this.SelectedDepartment,
            PartyContactPerson_Remarks: this.EnteredRemarks,
            PartyContactPerson_Mobile: this.EnteredMobile,
            PartyContactPerson_Phone: this.EnteredLandline,
            Party_IsDefaultContact: this.DefaultValue
          }

          console.log(data);

          this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/ContactPersonMasterSave?Data=" + JSON.stringify(data) + "&LoggedinContactID=1",
            {
              headers: this.global.ApiInsertHeaders
            }).subscribe(val => {
              console.log(val.Data.Result);
              if (val.Data.Result == "Success") {
                this.global.LoadingHide();
                this.global.ToastShow("Added Successfully.")
                this.navCtrl.setRoot(ContactlistPage);
              }
              else {
                this.global.LoadingHide();
                this.global.ToastShow("something went wrong please try again.")
                this.navCtrl.setRoot(ContactlistPage);
              }
            })
        }
      })
    }
  }

}
