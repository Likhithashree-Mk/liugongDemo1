import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  SelectedBrandList: any = [];
  FinalSelectedBrandList: any = [];
  ProductsListSeartcText: string;

  SelectedBrand: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {

    this.SelectedBrandList = this.navParams.get("data");
    this.FinalSelectedBrandList = this.SelectedBrandList;
    console.log(this.SelectedBrandList);

  }

  ProductModelClose() {

    this.viewCtrl.dismiss({ data: this.SelectedBrand });

  }

  ProductsListCount() {

    this.FinalSelectedBrandList = this.SelectedBrandList.filter(p => p.Product_SerialNumber.toLowerCase().trim().includes(this.ProductsListSeartcText.toLowerCase().trim()));

    console.log(this.FinalSelectedBrandList);

  }

  SelectedProduct(val) {

    this.SelectedBrand = val;
    this.viewCtrl.dismiss({ data: this.SelectedBrand });

  }

}
