import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';
import { ContactlistPage } from '../contactlist/contactlist';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-contactedit',
  templateUrl: 'contactedit.html',
})

export class ContacteditPage {

  SelectedDesignation: any;
  SelectedDepartment: any;
  validName: boolean = false;
  validMob: boolean = false;
  validEmail: boolean = false;
  validlandline: boolean = false;
  duplicateMobileno: boolean = false;
  DepartmentList: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Update Contact Person";

  }

  ngOnInit() {

    this.SelectedDesignation = this.global.SelectedContactList.Designation;
    this.SelectedDepartment = this.global.SelectedContactList.Department;

    //Department list
    this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/GetReferenceMasterData?ReferenceMasterName=DEPARTMENT&Company_ID=1&Language_ID=0", {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {
      this.DepartmentList = val;
      console.log(this.DepartmentList);
    })

    console.log(this.SelectedDesignation)
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
      //Checking duplicate Mobile num
      this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/checkDuplicateMobileNumber?MobileNumber=" + mob + "&Party_ID=" + this.global.PartyId + "&PartyContactPersonID=0", {
        headers: this.global.ApiReadHeaders
      }).subscribe(val => {
        console.log(val);
        if (val == true) {
          // this.global.ToastShow("Mobile number already exist")
          this.duplicateMobileno = true;
        } else {
          this.duplicateMobileno = false;
        }
      })
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

  DesignationChange(val) {
    console.log(val);
  }

  BackToPage() {
    this.navCtrl.setRoot(ContactlistPage);
  }

  Save() {

    var data;
    // debugger

    console.log(this.global.SelectedContactList);
    if (this.global.SelectedContactList.PartyContactPerson_Name.trim() == "" || this.global.SelectedContactList.PartyContactPerson_Mobile == null) {
      this.global.ToastShow("Please enter mandatory (*) fields");
    }
    else if (this.validName == true || this.validMob == true || this.validEmail == true || this.validlandline == true) {
      this.global.ToastShow("Please enter valid details");
    }
    else if (this.duplicateMobileno == true) {
      this.global.ToastShow("Mobile number already exists.");
    }
    else {
      data = {
        Party_ID: this.global.PartyId,
        PartyContactPerson_ID: this.global.SelectedContactList.PartyContactPerson_ID,
        PartyContactPerson_Name: this.global.SelectedContactList.PartyContactPerson_Name,
        PartyContactPerson_Email: this.global.SelectedContactList.PartyContactPerson_Email == null ? "" : this.global.SelectedContactList.PartyContactPerson_Email,
        PartyContactPerson_Department: this.global.SelectedContactList.PartyContactPerson_Department,
        PartyContactPerson_Remarks: this.global.SelectedContactList.PartyContactPerson_Remarks,
        PartyContactPerson_Mobile: this.global.SelectedContactList.PartyContactPerson_Mobile,
        PartyContactPerson_Phone: this.global.SelectedContactList.PartyContactPerson_Phone,
        Party_IsDefaultContact: this.global.SelectedContactList.Party_IsDefaultContact
      }
      console.log(data);
      this.global.LoadingShow("Please wait")
      this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/ContactPersonMasterSave?Data=" + JSON.stringify(data) + "&LoggedinContactID=1",
        {
          headers: this.global.ApiInsertHeaders
        }).subscribe(val => {
          console.log(val.Data.Result);
          if (val.Data.Result == "Success") {
            this.global.LoadingHide();
            this.global.ToastShow("Updated Successfully.")
            this.navCtrl.setRoot(ContactlistPage);
          }
          else {
            this.global.LoadingHide();
            this.global.ToastShow("something went wrong please try again.")
            this.navCtrl.setRoot(ContactlistPage);
          }
        });
    }

  }

}
