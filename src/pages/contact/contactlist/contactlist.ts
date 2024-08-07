import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../home/home';
import { GlobalProvider } from '../../../providers/global/global';
import { ContacteditPage } from '../contactedit/contactedit';
import { ContactaddPage } from '../contactadd/contactadd';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-contactlist',
  templateUrl: 'contactlist.html',
})
export class ContactlistPage {

  ContactList: any = [];
  ContactListCopy: any = [];
  CPSrchText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public httpClient: HttpClient) {
  }

  ngOnInit() {

    this.httpClient.get<any>(this.global.HostedPath + "api/GeneralAPI/GetPartyDetailsByPartyID?PartyID=" + this.global.PartyId, {
      headers: this.global.ApiReadHeaders
    }).subscribe(val => {
      console.log(val);
      val.forEach(e => {
        if (e.Name == "ContactPersons") {
          console.log(e.Value);
          this.ContactList = e.Value;
        }
      });
      this.ContactListCopy = Object.assign([], this.ContactList);
    })

  }

  SelectedContactName(val) {

    this.global.SelectedContactList = val;
    this.navCtrl.setRoot(ContacteditPage);

  }


  ListCount() {
    this.ContactList = this.ContactListCopy.filter(
      p => p.PartyContactPerson_Name.toLowerCase().trim().includes(this.CPSrchText.toLowerCase().trim())
      // || p.Department.toLowerCase().trim().includes(this.CPSrchText.toLowerCase().trim())
      // || p.Designation.toLowerCase().trim().includes(this.CPSrchText.toLowerCase().trim())
    );
    console.log(this.ContactList);
  }

  BackToPage() {
    this.navCtrl.setRoot(HomePage);
  }

  AddCp() {
    this.navCtrl.setRoot(ContactaddPage);
  }

}
