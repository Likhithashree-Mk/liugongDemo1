import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalProvider } from '../../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-ticketstatushistory',
  templateUrl: 'ticketstatushistory.html',
})
export class TicketstatushistoryPage {

  TicketHistoryList: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public global: GlobalProvider) {    

      this.TicketHistoryList=this.navParams.get("data");

  }

  ModelClose() {
    this.viewCtrl.dismiss();
  }

}
