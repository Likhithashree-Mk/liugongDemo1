import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-jcstatushistory',
  templateUrl: 'jcstatushistory.html',
})

export class JcstatushistoryPage {

  JcStatusHistoryList: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {

    this.JcStatusHistoryList = this.navParams.get("data");

  }

  ModelClose() {
    this.viewCtrl.dismiss();
  }


}
