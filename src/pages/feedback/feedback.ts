import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  ProfessionalBehaviourForm: FormGroup;
  ProfessionalBehaviourID: number = 0;
  ProfessionalBehaviourText: string = "Not Rated";
  ProfessionalBehaviourColor: string = "#4c565a";
  ProfessionalBehaviourRatingReasonData: any = [];
  ProfessionalBehaviourRatingReasonValue: number = 0;
  ProfessionalBehaviourRatingValue: number = 0;
  ProfessionalBehaviourRemarks: string = "";

  EmployeeSkillForm: FormGroup;
  EmployeeSkillID: number = 0;
  EmployeeSkillText: string = "Not Rated";
  EmployeeSkillColor: string = "#4c565a";
  EmployeeSkillRatingReasonData: any = [];
  EmployeeSkillRatingReasonValue: number = 0;
  EmployeeSkillRatingValue: number = 0;
  EmployeeSkillRemarks: string = "";

  PartSupportForm: FormGroup;
  PartSupportID: number = 0;
  PartSupportText: string = "Not Rated";
  PartSupportColor: string = "#4c565a";
  PartSupportRatingReasonData: any = [];
  PartSupportRatingReasonValue: number = 0;
  PartSupportRatingValue: number = 0;
  PartSupportRemarks: string = "";

  ResolutionTimeForm: FormGroup;
  ResolutionTimeID: number = 0;
  ResolutionTimeText: string = "Not Rated";
  ResolutionTimeColor: string = "#4c565a";
  ResolutionTimeRatingReasonData: any = [];
  ResolutionTimeRatingReasonValue: number = 0;
  ResolutionTimeRatingValue: number = 0;
  ResolutionTimeRemarks: string = "";

  MachinePerformanceForm: FormGroup;
  MachinePerformanceID: number = 0;
  MachinePerformanceText: string = "Not Rated";
  MachinePerformanceColor: string = "#4c565a";
  MachinePerformanceRatingReasonData: any = [];
  MachinePerformanceRatingReasonValue: number = 0;
  MachinePerformanceRatingValue: number = 0;
  MachinePerformanceRemarks: string = "";

  OverallSatisficationForm: FormGroup;
  OverallSatisficationID: number = 0;
  OverallSatisficationText: string = "Not Rated";
  OverallSatisficationColor: string = "#4c565a";
  OverallSatisficationRatingReasonData: any = [];
  OverallSatisficationRatingReasonValue: number = 0;
  OverallSatisficationRatingValue: number = 0;
  OverallSatisficationRemarks: string = "";

  IsNegativeFB: boolean = true;
  FeedbackDescription: any = "";

  //Rajesh
  FeedbackDisplay: any[];
  activerating: number = 0;
  activeDes = "";
  FeedbacktabRequired: number;
  // ClickedSrIndex:number=0;
  // showrating:boolean=false;
  Checkboxdisable: boolean = false;
  EnteredComments = null;
  IsNegativefbValue: boolean = true;
  FeedbackSrQueueList: any = [];
  FeedbackJcQueueList: any = []
  FeedbackAllQueueList: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    private formBuilder: FormBuilder,
    public httpClient: HttpClient) {

    this.global.HeaderTitle = "Feedback";
    this.global.sidemenushow = true;

    this.ProfessionalBehaviourForm = this.formBuilder.group({
      starRating: [0]
    });

    this.EmployeeSkillForm = this.formBuilder.group({
      starRating: [0]
    });

    this.PartSupportForm = this.formBuilder.group({
      starRating: [0]
    });

    this.ResolutionTimeForm = this.formBuilder.group({
      starRating: [0]
    });

    this.MachinePerformanceForm = this.formBuilder.group({
      starRating: [0]
    });

    this.OverallSatisficationForm = this.formBuilder.group({
      starRating: [0]
    });

  }

  ngOnInit() {

    //let that = this;

    //this.FeedbacktabRequired = 2;  //2-both, 1-seperate
    this.FeedbacktabRequired = this.global.UserDetails[0].FeedbacktabRequired;  //2-both, 1-seperate


    //SR feedback queue
    this.global.LoadingShow("Please wait...");
    console.log(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetClosedCallDetails?MobileNumber=" + this.global.MobileNumber + "&Party_ID=" + this.global.PartyId);
    this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetClosedCallDetails?MobileNumber=" + this.global.MobileNumber + "&Party_ID=" + this.global.PartyId, {
      headers: this.global.ApiReadHeaders
    }).subscribe(sr => {
      console.log(sr);
      if (sr.length != 0 || sr.length == 0) {
        this.FeedbackSrQueueList = [];
        this.FeedbackSrQueueList = sr;
        // this.FeedbackAllQueueList = Object.assign(this.FeedbackSrQueueList);
        var srlen = this.FeedbackSrQueueList.length;
          let r = 0;
          while (r != srlen) {
            this.FeedbackAllQueueList.push(this.FeedbackSrQueueList[r]);
            r++;
          }
        console.log(this.FeedbackSrQueueList);

        //JC feedback queue
        console.log(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetJCClosedCallDetails?MobileNumber=" + this.global.MobileNumber + "&Party_ID=" + this.global.PartyId)
        this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/GetJCClosedCallDetails?MobileNumber=" + this.global.MobileNumber + "&Party_ID=" + this.global.PartyId, {
          headers: this.global.ApiReadHeaders
        }).subscribe(val => {
          console.log(val);
          this.FeedbackJcQueueList = [];
          this.FeedbackJcQueueList = val;

          var len = this.FeedbackJcQueueList.length;
          let i = 0;
          while (i != len) {
            this.FeedbackAllQueueList.push(this.FeedbackJcQueueList[i]);
            i++;
          }
          this.global.LoadingHide();
          console.log(this.FeedbackSrQueueList.length);
          console.log(this.FeedbackJcQueueList.length);
          console.log(this.FeedbackAllQueueList);
        })

      }

    })

    // this.FeedbackSrQueueList = [
    //   {
    //     "ServiceRequest_ID": 1288,
    //     "ServiceRequestNumber": "HD/LI/188/2023",
    //     "ServiceRequestDate": "2023-11-17T13:04:00",
    //     "CallDescription": "SR test",
    //     "User_ID": 456,
    //     "CallType": null,
    //     "Status": "Closed",
    //     "Caseowner": "Vishwajeet Singh",
    //     "Contatctno": "",
    //     "Company_ID": 0,
    //     "Branch_ID": 0,
    //     "CustomerRating": 0,
    //     "CustomerFeedback": null,
    //     "JobCardID": 4005,
    //     "JobCardNumber": "JC/KR/88/2023",
    //     "JobCardDate": "2023-11-17T13:08:42.383",
    //     "CustomerComplaint": "SR test"
    //   }
    // ]
    // this.FeedbackJcQueueList = [
    //   {
    //     "ServiceRequest_ID": 1225,
    //     "ServiceRequestNumber": "HD/LI/187/2023",
    //     "ServiceRequestDate": "2023-11-17T13:04:00",
    //     "CallDescription": "JC test",
    //     "User_ID": 456,
    //     "CallType": null,
    //     "Status": "Closed",
    //     "Caseowner": "Vishwajeet Singh",
    //     "Contatctno": "",
    //     "Company_ID": 0,
    //     "Branch_ID": 0,
    //     "CustomerRating": 0,
    //     "CustomerFeedback": null,
    //     "JobCardID": 4005,
    //     "JobCardNumber": "JC/KR/99/2023",
    //     "JobCardDate": "2023-11-17T13:08:42.383",
    //     "CustomerComplaint": "JC test"
    //   },
    //   {
    //     "ServiceRequest_ID": 0,
    //     "ServiceRequestNumber": null,
    //     "ServiceRequestDate": null,
    //     "CallDescription": null,
    //     "User_ID": 456,
    //     "CallType": null,
    //     "Status": "Closed",
    //     "Caseowner": "Vishwajeet Singh",
    //     "Contatctno": "",
    //     "Company_ID": 0,
    //     "Branch_ID": 0,
    //     "CustomerRating": 0,
    //     "CustomerFeedback": null,
    //     "JobCardID": 4004,
    //     "JobCardNumber": "JC/KR/98/2023",
    //     "JobCardDate": "2023-11-10T17:24:37.023",
    //     "CustomerComplaint": "sd"
    //   }
    // ]
    // var srlen = this.FeedbackSrQueueList.length;
    // let r = 0;
    // while (r != srlen) {
    //   this.FeedbackAllQueueList.push(this.FeedbackSrQueueList[r]);
    //   r++;
    // }
    // var len = this.FeedbackJcQueueList.length;
    // let i = 0;
    // while (i != len) {
    //   this.FeedbackAllQueueList.push(this.FeedbackJcQueueList[i]);
    //   i++;
    // }
    // console.log(this.FeedbackSrQueueList.length);
    // console.log(this.FeedbackJcQueueList.length);
    // console.log(this.FeedbackAllQueueList);


    this.FeedbackDisplay = [
      {
        "Rating": 1,
        "Des": "very dissatisfied"
      },
      {
        "Rating": 2,
        "Des": "dissatisfied"
      },
      {
        "Rating": 3,
        "Des": "slightly dissatisfied"
      },
      {
        "Rating": 4,
        "Des": "Neutral"
      },
      {
        "Rating": 5,
        "Des": "slightly satisfied"
      },
      {
        "Rating": 6,
        "Des": "satisfied"
      },
      {
        "Rating": 7,
        "Des": "very satisfied"
      },
      {
        "Rating": 8,
        "Des": "extremely satisfied"
      },
      {
        "Rating": 9,
        "Des": "exceptionally satisfied"
      },
      {
        "Rating": 10,
        "Des": "completely satisfied"
      }
    ]

  }

  RatingClick(rating) {
    console.log(rating);
    // console.log(this.ClickedSrIndex)
    // this.ClickedSrIndex=sr;
    this.activerating = rating.Rating;
    this.activeDes = rating.Des;
  }

  ShowratingClick(index) {
    // console.log(index)
    // this.activerating=0;
    // this.activeDes = "";
    // this.EnteredComments="";
    // this.ClickedSrIndex = index;
    // this.IsNegativefbValue =false;
    // this.showrating = !this.showrating;
    // this.showrating = true;
  }

  NegativeFbChange(val) {
    console.log(val);
    if (val == false) {
      this.activerating = 0;
    }
  }

  EachFeedbackSubmitClick(val) {
    if (val != undefined) {
      console.log(val.ServiceRequest_ID);
      console.log(val.JobCardID);
      console.log(this.activerating);
      console.log(this.EnteredComments);
      if (this.activerating == 0 && this.IsNegativefbValue == true) {
        this.global.ToastShow("Please Give Us Rating.");
      } else if (this.EnteredComments == null) {
        this.global.ToastShow("Please Give Us Customer Feedback.");
      } else {
        this.IsNegativefbValue = !this.IsNegativefbValue;
        console.log(this.IsNegativefbValue);
        if (val.ServiceRequest_ID != 0 && this.FeedbackSrQueueList.length != 0) {
          //SR
          console.log("SR")
          this.global.LoadingShow("Please wait...");
          console.log(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateSRClosedCallDetails?ServiceRequestID=" + val.ServiceRequest_ID + "&CustomerFeedback=" + this.EnteredComments + "&CustomerRating=" + this.activerating + "&IsNegativeFeedback=" + this.IsNegativefbValue)
          this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateSRClosedCallDetails?ServiceRequestID=" + val.ServiceRequest_ID + "&CustomerFeedback=" + this.EnteredComments + "&CustomerRating=" + this.activerating + "&IsNegativeFeedback=" + this.IsNegativefbValue,
            {
              headers: this.global.ApiUpdatetHeaders
            }).subscribe(val => {
              console.log(val);
              if (val == "Saved") {
                this.global.LoadingHide();
                this.navCtrl.setRoot(FeedbackPage);
                this.global.ToastShow("Thank you, for your feedback.");
              } else {
                this.global.LoadingHide();
                this.global.ToastShow("Please give Customer feedback");
              }
            });
        }
        else if (val.JobCardID != 0 && this.FeedbackJcQueueList.length != 0) {
          //JC
          console.log("JC")
          this.global.LoadingShow("Please wait...");
          console.log(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateJCClosedCallDetails?JobCardID=" + val.JobCardID + "&CustomerFeedback=" + this.EnteredComments + "&CustomerRating=" + this.activerating + "&IsNegativeFeedback=" + this.IsNegativefbValue);

          this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateJCClosedCallDetails?JobCardID=" + val.JobCardID + "&CustomerFeedback=" + this.EnteredComments + "&CustomerRating=" + this.activerating + "&IsNegativeFeedback=" + this.IsNegativefbValue,
            {
              headers: this.global.ApiUpdatetHeaders
            }).subscribe(val => {
              console.log(val);
              if (val == "Saved") {
                this.global.LoadingHide();
                this.navCtrl.setRoot(FeedbackPage);
                this.global.ToastShow("Thank you, for your feedback.");
              } else {
                this.global.LoadingHide();
                this.global.ToastShow("Please give Customer feedback");
              }
            });
        }
      }
    }
    else {
      this.global.ToastShow("No Feedback to submit.");
    }
  }

  IgnoreClick(val) {
    if (val != undefined) {
      console.log(val.ServiceRequest_ID);
      console.log(val.JobCardID);
      let comments = "IGNORED BY CUSTOMER";
      this.IsNegativefbValue = !this.IsNegativefbValue;
      console.log(this.IsNegativefbValue);
      if (val.ServiceRequest_ID != 0 && this.FeedbackSrQueueList.length != 0) {
        //SR
        console.log("SR")
        console.log(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateSRClosedCallDetails?ServiceRequestID=" + val.ServiceRequest_ID + "&CustomerFeedback=" + comments + "&CustomerRating=0&IsNegativeFeedback=false");

        this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateSRClosedCallDetails?ServiceRequestID=" + val.ServiceRequest_ID + "&CustomerFeedback=" + comments + "&CustomerRating=0&IsNegativeFeedback=false",
          {
            headers: this.global.ApiUpdatetHeaders
          }).subscribe(val => {
            console.log(val);
            if (val == "Saved") {
              this.navCtrl.setRoot(FeedbackPage);
            }
          });
      }
      else if (val.JobCardID != 0 && this.FeedbackJcQueueList.length != 0) {
        //JC
        console.log("JC")
        this.httpClient.get<any>(this.global.HostedPath + "api/HelpDeskServiceRequestAPI/UpdateJCClosedCallDetails?JobCardID=" + val.JobCardID + "&CustomerFeedback=" + comments + "&CustomerRating=0&IsNegativeFeedback=false",
          {
            headers: this.global.ApiUpdatetHeaders
          }).subscribe(val => {
            console.log(val);
            if (val == "Saved") {
              this.navCtrl.setRoot(FeedbackPage);
            }
          });
      }
    }
    else {
      this.global.ToastShow("No Feedback to ignore.");
    }
  }

  ProfessionalBehaviourRatingChange(rating) {

    switch (rating) {

      case 1:
        this.ProfessionalBehaviourText = "Poor";
        this.ProfessionalBehaviourColor = "#d9534f";
        this.ProfessionalBehaviourRatingValue = 1;
        this.FeedbackReasonData(this.ProfessionalBehaviourID, 1, 1);
        break;

      case 2:
        this.ProfessionalBehaviourText = "Average";
        this.ProfessionalBehaviourColor = "#f0ad4e";
        this.ProfessionalBehaviourRatingValue = 2;
        this.FeedbackReasonData(this.ProfessionalBehaviourID, 2, 1);
        break;

      case 3:
        this.ProfessionalBehaviourText = "Good";
        this.ProfessionalBehaviourColor = "#5bc0de";
        this.ProfessionalBehaviourRatingValue = 3;
        this.FeedbackReasonData(this.ProfessionalBehaviourID, 3, 1);
        break;

      case 4:
        this.ProfessionalBehaviourText = "Excellent";
        this.ProfessionalBehaviourColor = "#428bca";
        this.ProfessionalBehaviourRatingValue = 4;
        this.ProfessionalBehaviourRatingReasonValue = 0;
        this.ProfessionalBehaviourRatingReasonData = [];
        break;

      case 5:
        this.ProfessionalBehaviourText = "Outstanding";
        this.ProfessionalBehaviourColor = "#5cb85c";
        this.ProfessionalBehaviourRatingValue = 5;
        this.ProfessionalBehaviourRatingReasonValue = 0;
        this.ProfessionalBehaviourRatingReasonData = [];
        break;

    }

  }

  ProfessionalBehaviourRatingRestClick() {

    this.ProfessionalBehaviourForm.reset();
    this.ProfessionalBehaviourText = "Not Rated";
    this.ProfessionalBehaviourColor = "#4c565a";
    this.ProfessionalBehaviourRatingValue = 0;
    this.ProfessionalBehaviourRatingReasonValue = 0;

  }

  EmployeeSkillRatingChange(rating) {

    switch (rating) {

      case 1:
        this.EmployeeSkillText = "Poor";
        this.EmployeeSkillColor = "#d9534f";
        this.EmployeeSkillRatingValue = 1;
        this.FeedbackReasonData(this.EmployeeSkillID, 1, 2);
        break;

      case 2:
        this.EmployeeSkillText = "Average";
        this.EmployeeSkillColor = "#f0ad4e";
        this.EmployeeSkillRatingValue = 2;
        this.FeedbackReasonData(this.EmployeeSkillID, 2, 2);
        break;

      case 3:
        this.EmployeeSkillText = "Good";
        this.EmployeeSkillColor = "#5bc0de";
        this.EmployeeSkillRatingValue = 3;
        this.FeedbackReasonData(this.EmployeeSkillID, 3, 2);
        break;

      case 4:
        this.EmployeeSkillText = "Excellent";
        this.EmployeeSkillColor = "#428bca";
        this.EmployeeSkillRatingValue = 4;
        this.EmployeeSkillRatingReasonValue = 0;
        this.EmployeeSkillRatingReasonData = [];
        break;

      case 5:
        this.EmployeeSkillText = "Outstanding";
        this.EmployeeSkillColor = "#5cb85c";
        this.EmployeeSkillRatingValue = 5;
        this.EmployeeSkillRatingReasonValue = 0;
        this.EmployeeSkillRatingReasonData = [];
        break;

    }

  }

  EmployeeSkillFormRatingRestClick() {

    this.EmployeeSkillForm.reset();
    this.EmployeeSkillText = "Not Rated";
    this.EmployeeSkillColor = "#4c565a";
    this.EmployeeSkillRatingValue = 0;
    this.EmployeeSkillRatingReasonValue = 0;

  }

  PartSupportRatingChange(rating) {

    switch (rating) {

      case 1:
        this.PartSupportText = "Poor";
        this.PartSupportColor = "#d9534f";
        this.PartSupportRatingValue = 1;
        this.FeedbackReasonData(this.PartSupportID, 1, 3);
        break;

      case 2:
        this.PartSupportText = "Average";
        this.PartSupportColor = "#f0ad4e";
        this.PartSupportRatingValue = 2;
        this.FeedbackReasonData(this.PartSupportID, 2, 3);
        break;

      case 3:
        this.PartSupportText = "Good";
        this.PartSupportColor = "#5bc0de";
        this.PartSupportRatingValue = 3;
        this.FeedbackReasonData(this.PartSupportID, 3, 3);
        break;

      case 4:
        this.PartSupportText = "Excellent";
        this.PartSupportColor = "#428bca";
        this.PartSupportRatingValue = 4;
        this.PartSupportRatingReasonValue = 0;
        this.PartSupportRatingReasonData = [];
        break;

      case 5:
        this.PartSupportText = "Outstanding";
        this.PartSupportColor = "#5cb85c";
        this.PartSupportRatingValue = 5;
        this.PartSupportRatingReasonValue = 0;
        this.PartSupportRatingReasonData = [];
        break;

    }

  }

  PartSupportRatingRestClick() {

    this.PartSupportForm.reset();
    this.PartSupportText = "Not Rated";
    this.PartSupportColor = "#4c565a";
    this.PartSupportRatingValue = 0;
    this.PartSupportRatingReasonValue = 0;

  }

  ResolutionTimeRatingChange(rating) {

    switch (rating) {

      case 1:
        this.ResolutionTimeText = "Poor";
        this.ResolutionTimeColor = "#d9534f";
        this.ResolutionTimeRatingValue = 1;
        this.FeedbackReasonData(this.ResolutionTimeID, 1, 4);
        break;

      case 2:
        this.ResolutionTimeText = "Average";
        this.ResolutionTimeColor = "#f0ad4e";
        this.ResolutionTimeRatingValue = 2;
        this.FeedbackReasonData(this.ResolutionTimeID, 2, 4);
        break;

      case 3:
        this.ResolutionTimeText = "Good";
        this.ResolutionTimeColor = "#5bc0de";
        this.ResolutionTimeRatingValue = 3;
        this.FeedbackReasonData(this.ResolutionTimeID, 3, 4);
        break;

      case 4:
        this.ResolutionTimeText = "Excellent";
        this.ResolutionTimeColor = "#428bca";
        this.ResolutionTimeRatingValue = 4;
        this.ResolutionTimeRatingReasonValue = 0;
        this.ResolutionTimeRatingReasonData = [];
        break;

      case 5:
        this.ResolutionTimeText = "Outstanding";
        this.ResolutionTimeColor = "#5cb85c";
        this.ResolutionTimeRatingValue = 5;
        this.ResolutionTimeRatingReasonValue = 0;
        this.ResolutionTimeRatingReasonData = [];
        break;

    }

  }

  ResolutionTimeRatingRestClick() {

    this.ResolutionTimeForm.reset();
    this.ResolutionTimeText = "Not Rated";
    this.ResolutionTimeColor = "#4c565a";
    this.ResolutionTimeRatingValue = 0;
    this.ResolutionTimeRatingReasonValue = 0;

  }

  MachinePerformanceRatingChange(rating) {

    switch (rating) {

      case 1:
        this.MachinePerformanceText = "Poor";
        this.MachinePerformanceColor = "#d9534f";
        this.MachinePerformanceRatingValue = 1;
        this.FeedbackReasonData(this.MachinePerformanceID, 1, 5);
        break;

      case 2:
        this.MachinePerformanceText = "Average";
        this.MachinePerformanceColor = "#f0ad4e";
        this.MachinePerformanceRatingValue = 2;
        this.FeedbackReasonData(this.MachinePerformanceID, 2, 5);
        break;

      case 3:
        this.MachinePerformanceText = "Good";
        this.MachinePerformanceColor = "#5bc0de";
        this.MachinePerformanceRatingValue = 3;
        this.FeedbackReasonData(this.MachinePerformanceID, 3, 5);
        break;

      case 4:
        this.MachinePerformanceText = "Excellent";
        this.MachinePerformanceColor = "#428bca";
        this.MachinePerformanceRatingValue = 4;
        this.MachinePerformanceRatingReasonValue = 0;
        this.MachinePerformanceRatingReasonData = [];
        break;

      case 5:
        this.MachinePerformanceText = "Outstanding";
        this.MachinePerformanceColor = "#5cb85c";
        this.MachinePerformanceRatingValue = 5;
        this.MachinePerformanceRatingReasonValue = 0;
        this.MachinePerformanceRatingReasonData = [];
        break;

    }

  }

  MachinePerformanceRatingRestClick() {

    this.MachinePerformanceForm.reset();
    this.MachinePerformanceText = "Not Rated";
    this.MachinePerformanceColor = "#4c565a";
    this.MachinePerformanceRatingValue = 0;
    this.MachinePerformanceRatingReasonValue = 0;

  }

  OverallSatisficationRatingChange(rating) {

    switch (rating) {

      case 1:
        this.OverallSatisficationText = "Poor";
        this.OverallSatisficationColor = "#d9534f";
        this.OverallSatisficationRatingValue = 1;
        this.FeedbackReasonData(this.OverallSatisficationID, 1, 6);
        break;

      case 2:
        this.OverallSatisficationText = "Average";
        this.OverallSatisficationColor = "#f0ad4e";
        this.OverallSatisficationRatingValue = 2;
        this.FeedbackReasonData(this.OverallSatisficationID, 2, 6);
        break;

      case 3:
        this.OverallSatisficationText = "Good";
        this.OverallSatisficationColor = "#5bc0de";
        this.OverallSatisficationRatingValue = 3;
        this.FeedbackReasonData(this.OverallSatisficationID, 3, 6);
        break;

      case 4:
        this.OverallSatisficationText = "Excellent";
        this.OverallSatisficationColor = "#428bca";
        this.OverallSatisficationRatingValue = 4;
        this.OverallSatisficationRatingReasonValue = 0;
        this.OverallSatisficationRatingReasonData = [];
        break;

      case 5:
        this.OverallSatisficationText = "Outstanding";
        this.OverallSatisficationColor = "#5cb85c";
        this.OverallSatisficationRatingValue = 5;
        this.OverallSatisficationRatingReasonValue = 0;
        this.OverallSatisficationRatingReasonData = [];
        break;

    }

  }

  OverallSatisficationRatingRestClick() {

    this.OverallSatisficationForm.reset();
    this.OverallSatisficationText = "Not Rated";
    this.OverallSatisficationColor = "#4c565a";
    this.OverallSatisficationRatingValue = 0;
    this.OverallSatisficationRatingReasonValue = 0;

  }

  FeedbackReasonData(ParameterID, Rating, Parameter) {

    if (this.global.CheckInternetConnection()) {

      this.global.LoadingShow("Please wait...");

      this.httpClient.get<any>(this.global.HostedPath + "api/ServiceRequestAPI/GetCustomerFeedbackQuestion?Parameter_ID=" + ParameterID + "&Rating=" + Rating, {
        headers: this.global.ApiReadHeaders
      }).subscribe(customerFeedbackParameter => {

        switch (Parameter) {
          case 1:
            this.ProfessionalBehaviourRatingReasonData = customerFeedbackParameter;
            this.ProfessionalBehaviourRatingReasonValue = 0;
            break;
          case 2:
            this.EmployeeSkillRatingReasonData = customerFeedbackParameter;
            this.EmployeeSkillRatingReasonValue = 0;
            break;
          case 3:
            this.PartSupportRatingReasonData = customerFeedbackParameter;
            this.PartSupportRatingReasonValue = 0;
            break;
          case 4:
            this.ResolutionTimeRatingReasonData = customerFeedbackParameter;
            this.ResolutionTimeRatingReasonValue = 0;
            break;
          case 5:
            this.MachinePerformanceRatingReasonData = customerFeedbackParameter;
            this.MachinePerformanceRatingReasonValue = 0;
            break;
          case 6:
            this.OverallSatisficationRatingReasonData = customerFeedbackParameter;
            this.OverallSatisficationRatingReasonValue = 0;
            break;
          default:
            break;
        }

        this.global.LoadingHide();
      }, error => {
        console.log(error);
        this.global.LoadingHide();
      });

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  FeedbackCancelClick() {

    this.navCtrl.setRoot(HomePage);

  }

  FeedbackSubmitClick(TicketNo, type) {

    var datePipe = new DatePipe('en-US');

    var CurrentDate = datePipe.transform(new Date(), 'dd-MMM-yyyy hh:mm a');

    let FeedbackDetails = "{FeedbackData:[{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.ProfessionalBehaviourID + "',Rating:'" + this.ProfessionalBehaviourRatingValue + "',FeedbackParameterQuestionsID:'" + this.ProfessionalBehaviourRatingReasonValue + "', Remarks:'" + this.ProfessionalBehaviourRemarks + "',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.EmployeeSkillID + "',Rating:'" + this.EmployeeSkillRatingValue + "',FeedbackParameterQuestionsID:'" + this.EmployeeSkillRatingReasonValue + "', Remarks:'" + this.EmployeeSkillRemarks + "',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.PartSupportID + "',Rating:'" + this.PartSupportRatingValue + "',FeedbackParameterQuestionsID:'" + this.PartSupportRatingReasonValue + "', Remarks:'" + this.PartSupportRemarks + "',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.ResolutionTimeID + "',Rating:'" + this.ResolutionTimeRatingValue + "',FeedbackParameterQuestionsID:'" + this.ResolutionTimeRatingReasonValue + "', Remarks:'" + this.ResolutionTimeRemarks + "',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.MachinePerformanceID + "',Rating:'" + this.MachinePerformanceRatingValue + "',FeedbackParameterQuestionsID:'" + this.MachinePerformanceRatingReasonValue + "', Remarks:'" + this.MachinePerformanceRemarks + "',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.OverallSatisficationID + "',Rating:'" + this.OverallSatisficationRatingValue + "',FeedbackParameterQuestionsID:'" + this.OverallSatisficationRatingReasonValue + "', Remarks:'" + this.OverallSatisficationRemarks + "',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},]}"

    let IgnoredFeedbackDetails = "{FeedbackData:[{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.ProfessionalBehaviourID + "',Rating:99,FeedbackParameterQuestionsID:0, Remarks:'',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.EmployeeSkillID + "',Rating:99,FeedbackParameterQuestionsID:0, Remarks:'',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.PartSupportID + "',Rating:99,FeedbackParameterQuestionsID:0, Remarks:'',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.ResolutionTimeID + "',Rating:99,FeedbackParameterQuestionsID:0, Remarks:'',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.MachinePerformanceID + "',Rating:99,FeedbackParameterQuestionsID:0, Remarks:'',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},{ServiceRequest_ID:'" + this.global.FeedbackList[0].ServiceRequest_ID + "',FeedbackReceivedDate:'" + CurrentDate + "',Parameter_ID:'" + this.OverallSatisficationID + "',Rating:99,FeedbackParameterQuestionsID:0, Remarks:'',FeedbackGiveBy:'" + this.global.FeedbackList[0].User_ID + "'},]}"

    if (this.global.CheckInternetConnection()) {

      if (type == 1) {
        debugger;
        console.log(this.global.HostedPath + "api/ServiceRequestAPI/UpdateClosedCallDetails?Ticketno=" + TicketNo + "&ClosingDescription=" + encodeURIComponent(this.FeedbackDescription) + "&CustomerRating=99&FeedbackSatisfied=false&RatingReason=0&isIgnore=true&FeedbackData=" + IgnoredFeedbackDetails);
        this.httpClient.post<any>(this.global.HostedPath + "api/ServiceRequestAPI/UpdateClosedCallDetails?Ticketno=" + TicketNo + "&ClosingDescription=" + encodeURIComponent(this.FeedbackDescription) + "&CustomerRating=99&FeedbackSatisfied=false&RatingReason=0&isIgnore=true&FeedbackData=" + IgnoredFeedbackDetails, null, {
          headers: this.global.ApiInsertHeaders
        }).subscribe(feedbackData => {

          console.log(feedbackData);

          if (feedbackData == "1") {

            this.global.ToastShow("Updated successfully");

            this.navCtrl.setRoot(FeedbackPage)

          }
          else {

            this.global.ToastShow("Could not submit request,please try again later");

          }

        }, error => {

          console.log(error);
          this.global.LoadingHide();

        });

      }
      else {

        if (this.FeedbackValidation()) {
          debugger;
          console.log(this.global.HostedPath + "api/ServiceRequestAPI/UpdateClosedCallDetails?Ticketno=" + TicketNo + "&ClosingDescription=" + encodeURIComponent(this.FeedbackDescription) + "&CustomerRating=0&FeedbackSatisfied=" + this.IsNegativeFB + "&RatingReason=0&isIgnore=false&FeedbackData=" + encodeURIComponent(FeedbackDetails));
          this.httpClient.post<any>(this.global.HostedPath + "api/ServiceRequestAPI/UpdateClosedCallDetails?Ticketno=" + TicketNo + "&ClosingDescription=" + encodeURIComponent(this.FeedbackDescription) + "&CustomerRating=0&FeedbackSatisfied=" + this.IsNegativeFB + "&RatingReason=0&isIgnore=false&FeedbackData=" + encodeURIComponent(FeedbackDetails), null, {
            headers: this.global.ApiInsertHeaders
          }).subscribe(feedbackData => {

            console.log(feedbackData);

            if (feedbackData == "1") {

              this.global.ToastShow("Submitted successfully");

              this.navCtrl.setRoot(FeedbackPage)

            }
            else {

              this.global.ToastShow("Could not submit request,please try again later");

            }

          }, error => {

            console.log(error);
            this.global.LoadingHide();

          });

        }

      }

    }
    else {
      this.global.ToastShow("Please check your internet connection");
    }

  }

  FeedbackValidation() {

    let ProfessionalBehaviourValidation = false;
    let EmployeeSkillValidation = false;
    let PartSupportValidation = false;
    let ResolutionTimeValidation = false;
    let MachinePerformanceValidation = false;
    let OverallSatisficationValidation = false;

    if (this.ProfessionalBehaviourRatingValue > 0) {
      if (this.ProfessionalBehaviourRatingValue <= 3) {

        if (this.ProfessionalBehaviourRatingReasonValue > 0 && this.ProfessionalBehaviourRemarks != "") {
          ProfessionalBehaviourValidation = true;
        }
        else {

          ProfessionalBehaviourValidation = false;
          this.global.ToastShow("Please fill Professional Behaviour reason and remarks");

        }

      } else {
        ProfessionalBehaviourValidation = true;
      }
    } else {
      ProfessionalBehaviourValidation = false;
      this.global.ToastShow("Please fill Professional Behaviour");
    }


    if (ProfessionalBehaviourValidation) {
      if (this.EmployeeSkillRatingValue > 0) {
        if (this.EmployeeSkillRatingValue <= 3) {

          if (this.EmployeeSkillRatingReasonValue > 0 && this.EmployeeSkillRemarks != "") {
            EmployeeSkillValidation = true;
          }
          else {

            EmployeeSkillValidation = false;
            this.global.ToastShow("Please fill Employee Skill reason and remarks");

          }

        } else {
          EmployeeSkillValidation = true;
        }
      } else {
        EmployeeSkillValidation = false;
        this.global.ToastShow("Please fill Employee Skill");
      }
    }


    if (EmployeeSkillValidation) {
      if (this.PartSupportRatingValue > 0) {
        if (this.PartSupportRatingValue <= 3) {

          if (this.PartSupportRatingReasonValue > 0 && this.PartSupportRemarks != "") {
            PartSupportValidation = true;
          }
          else {

            PartSupportValidation = false;
            this.global.ToastShow("Please fill Part Support reason and remarks");

          }

        } else {
          PartSupportValidation = true;
        }
      } else {
        PartSupportValidation = false;
        this.global.ToastShow("Please fill Part Support");
      }
    }


    if (PartSupportValidation) {
      if (this.ResolutionTimeRatingValue > 0) {
        if (this.ResolutionTimeRatingValue <= 3) {

          if (this.ResolutionTimeRatingReasonValue > 0 && this.ResolutionTimeRemarks != "") {
            ResolutionTimeValidation = true;
          }
          else {

            ResolutionTimeValidation = false;
            this.global.ToastShow("Please fill Resolution Time reason and remarks");

          }
        } else {
          ResolutionTimeValidation = true;
        }
      } else {
        ResolutionTimeValidation = false;
        this.global.ToastShow("Please fill Resolution Time");
      }
    }


    if (ResolutionTimeValidation) {
      if (this.MachinePerformanceRatingValue > 0) {
        if (this.MachinePerformanceRatingValue <= 3) {

          if (this.MachinePerformanceRatingReasonValue > 0 && this.MachinePerformanceRemarks != "") {
            MachinePerformanceValidation = true;
          }
          else {

            MachinePerformanceValidation = false;
            this.global.ToastShow("Please fill Machine Performance reason and remarks");

          }

        } else {
          MachinePerformanceValidation = true;
        }
      } else {
        MachinePerformanceValidation = false;
        this.global.ToastShow("Please fill Machine Performance");
      }
    }



    if (MachinePerformanceValidation) {
      if (this.OverallSatisficationRatingValue > 0) {
        if (this.OverallSatisficationRatingValue <= 3) {

          if (this.OverallSatisficationRatingReasonValue > 0 && this.OverallSatisficationRemarks != "") {
            OverallSatisficationValidation = true;
          }
          else {

            OverallSatisficationValidation = false;
            this.global.ToastShow("Please fill Overall Satisfication reason and remarks");

          }

        } else {
          OverallSatisficationValidation = true;
        }
      } else {
        OverallSatisficationValidation = false;
        this.global.ToastShow("Please fill Overall Satisfication rating");
      }
    }

    // if (this.ProfessionalBehaviourRatingValue == 0) {
    //   ProfessionalBehaviourValidation = false;
    // }
    // else if (this.ProfessionalBehaviourRatingValue <= 3) {
    //   if (this.ProfessionalBehaviourRatingReasonValue > 0 && this.ProfessionalBehaviourRemarks != "") {
    //     ProfessionalBehaviourValidation = true;
    //   }
    //   else {
    //     ProfessionalBehaviourValidation = false;
    //     this.global.ToastShow("Please fill Professional Behaviour reason and remarks");
    //   }
    // }
    // else if (this.ProfessionalBehaviourRatingValue > 3) {
    //   ProfessionalBehaviourValidation = true;
    // }

    // if (this.EmployeeSkillRatingValue == 0) {
    //   EmployeeSkillValidation = false;
    // }
    // else if (this.EmployeeSkillRatingValue <= 3) {
    //   if (this.EmployeeSkillRatingReasonValue > 0 && this.EmployeeSkillRemarks != "") {
    //     EmployeeSkillValidation = true;
    //   }
    //   else {
    //     EmployeeSkillValidation = false;
    //     this.global.ToastShow("Please fill Employee Skill reason and remarks");
    //   }
    // }
    // else if (this.EmployeeSkillRatingValue > 3) {
    //   EmployeeSkillValidation = true;
    // }

    // if (this.PartSupportRatingValue == 0) {
    //   PartSupportValidation = false;
    // }
    // else if (this.PartSupportRatingValue <= 3) {
    //   if (this.PartSupportRatingReasonValue > 0 && this.PartSupportRemarks != "") {
    //     PartSupportValidation = true;
    //   }
    //   else {
    //     PartSupportValidation = false;
    //     this.global.ToastShow("Please fill Part Support reason and remarks");
    //   }
    // }
    // else if (this.PartSupportRatingValue > 3) {
    //   PartSupportValidation = true;
    // }

    // if (this.ResolutionTimeRatingValue == 0) {
    //   ResolutionTimeValidation = false;
    // }
    // else if (this.ResolutionTimeRatingValue <= 3) {
    //   if (this.ResolutionTimeRatingReasonValue > 0 && this.ResolutionTimeRemarks != "") {
    //     ResolutionTimeValidation = true;
    //   }
    //   else {
    //     ResolutionTimeValidation = false;
    //     this.global.ToastShow("Please fill Resolution Time reason and remarks");
    //   }
    // }
    // else if (this.ResolutionTimeRatingValue > 3) {
    //   ResolutionTimeValidation = true;
    // }

    // if (this.MachinePerformanceRatingValue == 0) {
    //   MachinePerformanceValidation = false;
    // }
    // else if (this.MachinePerformanceRatingValue <= 3) {
    //   if (this.MachinePerformanceRatingReasonValue > 0 && this.MachinePerformanceRemarks != "") {
    //     MachinePerformanceValidation = true;
    //   }
    //   else {
    //     MachinePerformanceValidation = false;
    //     this.global.ToastShow("Please fill Machine Performance reason and remarks");
    //   }
    // }
    // else if (this.MachinePerformanceRatingValue > 3) {
    //   MachinePerformanceValidation = true;
    // }

    // if (this.OverallSatisficationRatingValue == 0) {
    //   OverallSatisficationValidation = false;
    // }
    // else if (this.OverallSatisficationRatingValue <= 3) {
    //   if (this.OverallSatisficationRatingReasonValue > 0 && this.OverallSatisficationRemarks != "") {
    //     OverallSatisficationValidation = true;
    //   }
    //   else {
    //     OverallSatisficationValidation = false;
    //     this.global.ToastShow("Please fill Machine Performance reason and remarks");
    //   }
    // }
    // else if (this.OverallSatisficationRatingValue > 3) {
    //   OverallSatisficationValidation = true;
    // }

    // if (ProfessionalBehaviourValidation &&
    //   EmployeeSkillValidation &&
    //   PartSupportValidation &&
    //   ResolutionTimeValidation &&
    //   MachinePerformanceValidation &&
    //   OverallSatisficationValidation) {
    //   IsFeedbackValid = true;
    // } else {
    //   if (ProfessionalBehaviourValidation) {

    //     if (EmployeeSkillValidation) {

    //       if (PartSupportValidation) {

    //         if (ResolutionTimeValidation) {

    //           if (MachinePerformanceValidation) {

    //             if (OverallSatisficationValidation) {
    //               IsFeedbackValid = true;
    //             }
    //             else {
    //               this.global.ToastShow("Please fill Overall Satisfication rating");
    //               IsFeedbackValid = false;
    //             }

    //           }
    //           else {
    //             this.global.ToastShow("Please fill Machine Performance rating");
    //             IsFeedbackValid = false;
    //           }

    //         }
    //         else {
    //           this.global.ToastShow("Please fill Resolution Time rating");
    //           IsFeedbackValid = false;
    //         }

    //       }
    //       else {
    //         this.global.ToastShow("Please fill Part Support rating");
    //         IsFeedbackValid = false;
    //       }

    //     }
    //     else {
    //       this.global.ToastShow("Please fill Employee Skill rating");
    //       IsFeedbackValid = false;
    //     }

    //   }
    //   else {
    //     this.global.ToastShow("Please fill Professional Behaviour rating");
    //     IsFeedbackValid = false;
    //   }
    // }

    return OverallSatisficationValidation;

  }

}