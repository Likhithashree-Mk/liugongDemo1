import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';
import { ProductsPage } from '../tickets/products/products';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {

  IsVehicleBreakdown: boolean = false;
  IsBreakdownLocation: boolean = false;

  ServiceRequestTab: string = "ComplaintDescription";

  BrandsDetails: any = [];
  Brands: any
  CustomerChangeValue: any;
  SelectedModel: string;
  ProductSerialno: any = [];
  State: string = "";
  City: string = "";
  AttachmentsList: any = [];
  CallType: string;
  ServiceEngineerID: string = "0";
  SelectedBrand: string = "-1";
  SelectedSerialNumber: string = "-1";
  HMRReading: string = "";
  CallDescription: string = "";
  PartyID: number = 0;
  CompanyID: string = "0";
  IsValidated: boolean = false;
  TodaysDate: string = "";
  SelectedMachine: any = [];
  base64Image: string;
  lastPhoto: any;
  uploadedFiles: any = [];
  AllUploadedFiles: any = [];
  PartyContactPersonID: string = "0";
  IsOperatorOrNot: boolean = false;
  OperatorID: string = "0";
  selectedCustomerID = -1;
  IsHrmReadingValid: boolean = false;
  IsLocationOn: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public global: GlobalProvider,
    public actionSheetCtrl: ActionSheetController,
    public modelCtrl: ModalController,
    public httpClient: HttpClient,
    public geolocation: Geolocation,
    private camera: Camera) {

    this.global.HeaderTitle = "Service Request";
    this.global.sidemenushow = true;

    let date = new Date();

    this.TodaysDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

    this.checkLocationEnabled();
  }

  // To Check weather Location is Turn On/Off
  async checkLocationEnabled() {
    try {
      const location = await this.geolocation.getCurrentPosition();
      this.IsLocationOn = true;
      console.log("Location:", location.coords);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  }

  ngOnInit() {

    if (this.global.UserDetails.length == 1) {

      this.global.LoadingShow("Please wait...");

      this.PartyID = this.global.UserDetails[0].Party;
      this.CompanyID = this.global.UserDetails[0].ComapnyID;
      this.IsOperatorOrNot = this.global.UserDetails[0].IsOperator;
      this.PartyContactPersonID = this.global.UserDetails[0].PartyContactPerson_ID;

      this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetCustomerProductDetails?MobileNumber=" + this.global.MobileNumber + "&PartyID=" + this.global.UserDetails[0].Party, {
        headers: this.global.ApiReadHeaders
      }).subscribe(productListData => {

        this.global.LoadingHide();

        console.log(productListData);

        this.BrandsDetails = productListData;

        if (productListData != null) {

          let tempBrand = [];

          productListData.filter(function (item) {

            var b = tempBrand.findIndex(x => x.BrandName == item.Brand);
            if (b <= -1) {
              tempBrand.push({
                BrandId: item.Brand_ID,
                BrandName: item.Brand,
                Product_ID: 3542,
                Product_SerialNumbe: "H216.1362",
                ServiceEngineer_ID: 88,
                Model_ID: 142,
                Model_Name: "311",
                ProductTypeID: 13,
                ProductType: "Soil Compactor",
                ProductCustomer_ToDate: null
              });
            }

          });

          this.Brands = tempBrand;

          console.log(this.Brands);

          if (this.Brands.length == 1) {
            this.SelectedBrand = this.Brands[0].BrandId;

            this.ProductSerialno = this.BrandsDetails.filter(b => b.Brand_ID == this.SelectedBrand);
            console.log(this.ProductSerialno);

          }

        }

      }, error => {

        console.log(error);
        this.global.LoadingHide();

      });

    }

  }

  AttachmentClick1() {

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select Attachments',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {

            document.getElementById("FileAttchments").click();

            // const options: CameraOptions = {
            //   quality: 100,
            //   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            //   saveToPhotoAlbum: false,
            //   correctOrientation: true
            // }

            // this.camera.getPicture(options).then((imageData) => {


            //   this.global.LoadingShow("Please wait...");

            //   let imageSplit = imageData.split("/");
            //   let imageName = imageSplit[imageSplit.length - 1].split("?")[0];

            //   this.AttachmentsList.push({
            //     path: imageData,
            //     description: "",
            //     fileName: { name: imageName }
            //   });

            //   this.global.LoadingHide();

            // }, (err) => {

            //   this.global.ToastShow("Error : " + err);
            //   this.global.LoadingHide();

            // });

          }
        },
        {
          text: 'Camera',
          handler: () => {

            const options: CameraOptions = {
              quality: 100,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE
            }

            this.camera.getPicture(options).then((imageData) => {
              debugger

              this.global.LoadingShow("Please wait...");

              let imageSplit = imageData.split("/");
              let imageName = imageSplit[imageSplit.length - 1];

              this.AttachmentsList.push({
                path: imageData,
                description: "",
                fileName: { name: imageName }
              });

              this.global.LoadingHide();

            }, (err) => {

              this.global.ToastShow("Error : " + err);
              this.global.LoadingHide();

            });

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]

    });

    actionSheet.present();

  }

  AttachmentClick() {

    const actionSheet = this.actionSheetCtrl.create({
      title: 'Add Photo',
      buttons: [
        {
          text: 'Capture Photo',
          handler: () => {
            this.CameraClick(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Choose from Gallery',
          handler: () => {
            this.CameraClick(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
    actionSheet.present();

  }

  FileChangeMethod(e) {

    console.log(e.target.files[0])

    // this.global.LoadingShow("Please wait...");

    // var reader = new FileReader();

    // reader.readAsDataURL(e.target.files[0]);

    // let that = this;

    // reader.onload = (_event) => {

    //   this.AttachmentsList.push({
    //     path: reader.result,
    //     description: "",
    //     photo: e.target.files[0]
    //   });

    //   console.log(this.AttachmentsList);

    //   this.global.LoadingHide();

    // }

    var formData = new FormData();

    formData.append("Photo_1", e.target.files[0], 'vvv');

    this.httpClient.post(this.global.HostedPath + 'api/HelpDeskServiceRequestAPI/UploadFile?ServiceRequest_ID=1144&Description=Desc111&User_ID=1&lattitude=12.8996&longitude=77.5687&Latlongaddress=Mysore', formData, {
      headers: new HttpHeaders({
        'Authorization': "12345Insert"
      }),
      responseType: "text"
    }).subscribe(imageUploadData => {

      console.log(imageUploadData);

    }, error => {

      console.log(error);

      this.global.ToastShow("Failed to-upload attachments");

    });

  }

  TicketSubmitClick() {

    if (this.global.CheckInternetConnection()) {

      var HMRReadingStr = this.HMRReading.toString();

      if (this.CallDescription != "" && this.PartyID != 0 && this.SelectedSerialNumber != "-1") {

        if (this.HMRReading == "") {
          this.CreateSR("0");
        }
        else if (HMRReadingStr.includes('.')) {
          // this.HMRReading = HMRReadingStr.split('.')[0];
          this.global.ToastShow("HMR value cannot be in decimals");
        }
        else {

          let today = new Date();
          let year = today.getFullYear();
          let month = ((today.getMonth() + 1) > 9) ? (today.getMonth() + 1) : ("0" + (today.getMonth() + 1));
          let day = (today.getDate() > 9) ? today.getDate() : ("0" + today.getDate());
          let hour = (today.getHours() > 9) ? today.getHours() : ("0" + today.getHours());
          let minut = (today.getMinutes() > 9) ? today.getMinutes() : ("0" + today.getMinutes());

          let HMRDateTime = year + "-" + month + "-" + day + "T" + hour + ":" + minut + ":00";

          this.httpClient.get<any>(this.global.HostedPath + "api/ProductMasterAPI/IsValidMachineReading?Product_ID=" + this.SelectedMachine.Product_ID + "&CurrentReading=" + this.HMRReading + "&CurrentReadingDate=" + HMRDateTime + "&IsUpdate=true", {
            headers: this.global.ApiReadHeaders
          }).subscribe(val => {

            console.log(val);

            if (val) {
              this.CreateSR(this.HMRReading);
            }
            else {
              this.global.ToastShow("Can't Update More Than 24 In a Day.")
            }

          }, error => {

            console.log(error);

          });

        }

      }
      else {

        this.global.LoadingHide();

        if (this.PartyID == 0) {
          this.global.ToastShow("Please select Customer");
        }
        else if (HMRReadingStr.includes('.')) {
          // this.HMRReading = HMRReadingStr.split('.')[0];
          this.global.ToastShow("HMR value cannot be in decimals");

        }
        else if (this.CallDescription.trim() == "") {
          this.global.ToastShow("Please enter Complaint Description");
        }
        else if (this.SelectedSerialNumber == "-1") {
          this.global.ToastShow("Please select Serial Number");
        }

      }

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  TicketCancelClick() {

    this.navCtrl.setRoot(HomePage);

    // for (let i = 0; i < this.AttachmentsList.length; i++) {

    //   var formData = new FormData();

    //   formData.append("Photo_" + i, this.AttachmentsList[i].photo, this.AttachmentsList[i].name);

    //   this.httpClient.post(this.global.HostedPath + "/api/HelpDeskServiceRequestAPI/UploadFile?ServiceRequest_ID=63722&Description=vvv&User_ID=1&lattitude=12.971599&longitude=77.594566&Latlongaddress=Banglore", formData, {
    //     headers: new HttpHeaders({
    //       'Authorization': "12345Insert"
    //     }),
    //     responseType: "text"
    //   }).subscribe(imageUploadData => {
    //     debugger
    //     console.log(imageUploadData);

    //   }, error => {
    //     debugger
    //     console.log(error)

    //   });

    // }

  }

  SelectMachineModel() {

    if (this.ProductSerialno.length > 0) {

      const model = this.modelCtrl.create(ProductsPage, { data: this.ProductSerialno });
      model.present();

      model.onDidDismiss(data => {

        console.log(data);

        if (data.data != undefined) {

          this.SelectedMachine = data.data;

          this.SelectedModel = data.data.Model_Name;

          this.SelectedSerialNumber = data.data.Product_SerialNumber;

          this.ServiceEngineerID = data.data.ServiceEngineer_ID;

        }

      });

    }
    else {
      this.global.ToastShow("Please select Brand first");
    }

  }

  PartyChange(ele) {

    if (this.global.CheckInternetConnection()) {

      //let selectedCustomerID = ele.target.options[ele.target.options.selectedIndex].value;

      this.global.LoadingShow("Please wait...");

      if (this.selectedCustomerID != -1) {

        this.PartyID = this.selectedCustomerID;
        this.CompanyID = this.global.UserDetails.filter(p => p.Party == this.PartyID)[0].ComapnyID;
        this.IsOperatorOrNot = this.global.UserDetails.filter(p => p.Party == this.PartyID)[0].IsOperator;

        if (this.IsOperatorOrNot == false) {
          this.PartyContactPersonID = this.global.UserDetails.filter(p => p.Party == this.PartyID)[0].PartyContactPerson_ID;
          this.OperatorID = '0'
        } else {
          this.OperatorID = this.global.UserDetails.filter(p => p.Party == this.PartyID)[0].PartyContactPerson_ID;
          this.PartyContactPersonID = '0';
        }


        this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetCustomerProductDetails?MobileNumber=" + localStorage.getItem("MobileNumber") + "&PartyID=" + this.selectedCustomerID, {
          headers: this.global.ApiReadHeaders
        }).subscribe(selectedCustomerProductListData => {

          this.BrandsDetails = selectedCustomerProductListData;

          console.log(selectedCustomerProductListData);

          if (selectedCustomerProductListData != null) {

            let tempBrand = [];

            selectedCustomerProductListData.filter(function (item) {

              var b = tempBrand.findIndex(x => x.BrandName == item.Brand);
              if (b <= -1) {
                tempBrand.push({
                  BrandId: item.Brand_ID,
                  BrandName: item.Brand,
                  Product_ID: 3542,
                  Product_SerialNumbe: "H216.1362",
                  ServiceEngineer_ID: 88,
                  Model_ID: 142,
                  Model_Name: "311",
                  ProductTypeID: 13,
                  ProductType: "Soil Compactor",
                  ProductCustomer_ToDate: null
                });
              }

            });

            this.Brands = tempBrand;

            console.log(this.Brands)

          }

          this.global.LoadingHide();

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }
      else {

        this.PartyID = 0;
        this.CompanyID = "0";
        this.global.LoadingHide();

      }

      this.SelectedSerialNumber = "-1";
      this.SelectedModel = "";

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  BrandChange(ele) {

    let selectedBrandID = ele.target.options[ele.target.options.selectedIndex].value;

    if (selectedBrandID != -1) {
      this.ProductSerialno = this.BrandsDetails.filter(b => b.Brand_ID == selectedBrandID);

      console.log(this.ProductSerialno);
    }
    else {
      this.SelectedSerialNumber = "-1";
      this.SelectedModel = "";
    }



  }

  IsBreakdownLocationChange(val) {

    if (this.global.CheckInternetConnection()) {

      let that = this;

      if (val) {

        if (this.IsLocationOn) {

          this.global.LoadingShow("Please wait...");

          this.geolocation.getCurrentPosition().then((resp) => {

            console.log(resp);

            that.httpClient.get<any>("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + resp.coords.latitude + "," + resp.coords.longitude + "&key=AIzaSyALqrc_I-5AIRWlmU9XH_13ZsuROsaBzjo").subscribe(locationData => {

              console.log(locationData);

              if (locationData != null) {

                for (var i = 0; i < locationData.results[0].address_components.length; i++) {

                  if (locationData.results[0].address_components[i].types[0] == "administrative_area_level_1") {

                    this.State = locationData.results[0].address_components[i].long_name;

                  }

                  if (locationData.results[0].address_components[i].types[0] == "locality") {

                    this.City = locationData.results[0].address_components[i].long_name;

                  }

                }

              }
              else {
                this.global.ToastShow('Error getting location');
              }

              this.global.LoadingHide();

            }, error => {

              console.log(error);
              this.global.LoadingHide();

            });

          }).catch((err) => {
            console.log(err);
            this.global.ToastShow('Error getting location ' + err);
            this.global.LoadingHide();
          });
        }
        else {
          this.IsBreakdownLocation = false;
          this.global.ToastShow('Please check your GPS location is enable or not');
        }

      }
      else {

        this.State = "";
        this.City = "";

      }

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  RemoveAttachment(i) {

    this.AttachmentsList.splice(i, 1);

  }

  ValidationBlur(val) {

    if (val == 1) {

      var exp = /^[A-z\s]{3,20}$/;
      var txt_match = this.State.trim().match(exp);
      if (txt_match != null) {
        this.IsValidated = false;
      }
      else {
        this.State = "";
        this.global.ToastShow('Please enter only characters and minimum length must be 3 and maximum length must be 20');
        this.IsValidated = true;
      }

    }

    if (val == 2) {

      var exp1 = /^[A-z\s]{3,30}$/;
      var txt_match1 = this.City.trim().match(exp1);
      if (txt_match1 != null) {
        this.IsValidated = true;
      }
      else {
        this.City = "";
        this.global.ToastShow('Please enter only characters and minimum length must be 3 and maximum length must be 30');
        this.IsValidated = true;
      }

    }

  }

  dataURItoBlob(dataURI) {

    // alert(dataURI);
    // alert(dataURI.split(',')[1]);
    var byteString = atob(dataURI.split(',')[1]);
    //  alert(byteString);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // alert(mimeString)
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });

    return bb;
  }

  CameraClick(sourceType) {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      debugger
      this.base64Image = 'data:image/jpeg;base64,' + imageData;

      var d = new Date();
      var n = d.getTime();

      this.lastPhoto = this.dataURItoBlob("data:image/jpeg;base64," + imageData);

      var date = new Date();

      var DateSplited = date.toString().split(":")[0] + date.toString().split(":")[1] + date.toString().split(":")[2];

      var CameraDate = DateSplited.toString().split(" ")[4];

      var MyImageName = "Image" + CameraDate + n + (this.uploadedFiles.length + 1) + ".JPG"

      this.AttachmentsList.push({
        name: MyImageName,
        path: this.base64Image,
        photo: this.lastPhoto,
        description: ""
      });

    }, (err) => {

      this.global.ToastShow(err)

    });

  }

  TabChange(tab) {

    switch (tab) {

      case "ComplaintDescription":

        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });

        break;

      case "MachineDetails":

        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 50,
          behavior: 'smooth'
        });

        break;

      case "LocationDetails":

        document.getElementsByClassName("scroll-content")[1].scrollTo({
          top: 0,
          left: 100,
          behavior: 'smooth'
        });

        break;

      case "Attachments":

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

  CreateSR(hmrReading) {

    let ComplaintDescription = "";

    if (this.State == "" && this.City == "") {
      ComplaintDescription = encodeURIComponent(this.CallDescription);
    }
    else {
      ComplaintDescription = encodeURIComponent(this.CallDescription + "\n" + this.State + "\n" + this.City);
    }

    let serialNumber = this.SelectedSerialNumber == "-1" ? "0" : this.SelectedSerialNumber;

    this.global.LoadingShow("Please wait...");

    if (this.AttachmentsList.length == 0) {

      this.httpClient.post<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/CreateTicketAPI?MobileNumber=" + this.global.UserDetails[0].MobileNumner + "&DateTime=" + this.TodaysDate + "&ProductReading=" + hmrReading + "&CallDescription=" + ComplaintDescription + "&Party_ID=" + this.global.UserDetails[0].Party + "&Company_ID=1&ReloginView=" + this.global.HostedPath + "&SerialNumber=" + serialNumber + "&IsBreakdown=" + this.IsVehicleBreakdown, null, {
        headers: this.global.ApiInsertHeaders
      }).subscribe(SRCreateData => {

        console.log(SRCreateData);

        if (SRCreateData[1].Value == "Success") {
          this.TicketRegisteredPopup();
        }
        else {
          this.global.ToastShow("Could not register please register again");
          this.navCtrl.setRoot(HomePage);
        }

        this.global.LoadingHide();

      }, error => {

        console.log(error);
        this.global.LoadingHide();

      });

    }
    else {

      let that = this;

      this.geolocation.getCurrentPosition().then((resp) => {

        console.log(resp);
        let LatlongAddress

        this.httpClient.get<any>("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + resp.coords.latitude + "," + resp.coords.longitude + "&key=AIzaSyALqrc_I-5AIRWlmU9XH_13ZsuROsaBzjo").subscribe(locationData => {

          console.log(locationData);
          LatlongAddress = locationData.results[0].formatted_address;

          if (locationData != null) {

            this.httpClient.post<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/CreateTicketAPI?MobileNumber=" + this.global.UserDetails[0].MobileNumner + "&DateTime=" + this.TodaysDate + "&ProductReading=" + hmrReading + "&CallDescription=" + ComplaintDescription + "&Party_ID=" + this.global.UserDetails[0].Party + "&Company_ID=1&ReloginView=" + this.global.HostedPath + "&SerialNumber=" + serialNumber + "&IsBreakdown=" + this.IsVehicleBreakdown, null, {
              headers: this.global.ApiInsertHeaders
            }).subscribe(SRCreateData => {

              console.log(SRCreateData);

              if (SRCreateData[1].Value == "Success") {

                this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetLastServiceRequestAPI", {
                  headers: this.global.ApiReadHeaders
                }).subscribe(function (LSRDeatils) {

                  console.log(LSRDeatils);

                  console.log(that.AttachmentsList);

                  if (that.AttachmentsList.length > 0) {

                    for (var i = 0; i < that.AttachmentsList.length; i++) {

                      var formData = new FormData();

                      formData.append("Photo_" + i, that.AttachmentsList[i].photo, that.AttachmentsList[i].name);

                      that.httpClient.post(that.global.HostedPath + 'api/HelpDeskServiceRequestAPI/UploadFile?ServiceRequest_ID=' + LSRDeatils["ID"] + '&Description=' + that.AttachmentsList[i].description + '&User_ID=1' + "&lattitude=" + resp.coords.latitude + "&longitude=" + resp.coords.longitude + "&Latlongaddress=" + LatlongAddress, formData, {
                        headers: new HttpHeaders({
                          'Authorization': "12345Insert"
                        }),
                        responseType: "text"
                      }).subscribe(imageUploadData => {

                        console.log(JSON.stringify(imageUploadData));
                        console.log("Uploaded Successfully");

                      }, error => {

                        console.log(JSON.stringify(error))

                        that.global.ToastShow("Failed to-upload attachments");

                      })

                      if (i == that.AttachmentsList.length - 1) {

                        that.global.LoadingHide();
                        that.TicketRegisteredPopup();

                      }

                    }

                  }

                }, function error(err) {
                  console.log(err);
                })

              }
              else {
                this.global.ToastShow("Could not register please register again");
                this.navCtrl.setRoot(HomePage);
              }

              this.global.LoadingHide();

            }, error => {

              console.log(error);
              this.global.LoadingHide();

            });

          }
          else {
            this.global.ToastShow('Error getting location');
          }

          this.global.LoadingHide();

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }).catch((error) => {
        this.global.ToastShow('Error getting location' + error);
      });

    }

  }

  TicketRegisteredPopup() {

    this.global.IsAlertOpen = true;

    let Alert1 = this.alertCtrl.create({
      subTitle: '<b>Message</b>',
      message: 'Dear Customer your Complaint has been registered in case of further inquiry you will get a call from 18001033852 please receive and revert',
      buttons: [
        {
          text: 'OK',
          cssClass: 'BtnOnePopup',
          handler: data => {

            this.global.IsAlertOpen = false;
            this.navCtrl.setRoot(HomePage);

          }
        }
      ],
      enableBackdropDismiss: false
    });

    Alert1.present();


  }

}