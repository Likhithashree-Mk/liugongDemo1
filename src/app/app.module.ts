import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule} from '@angular/common/http';
import { StarRatingModule } from 'ionic3-star-rating';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginotpPage } from '../pages/loginotp/loginotp';
import { HeaderPage } from '../pages/header/header';
import { FeedbackPage } from '../pages/feedback/feedback';
import { TrackingPage } from '../pages/tracking/tracking';
import { TicketsPage } from '../pages/tickets/tickets';
import { ProductsPage } from '../pages/tickets/products/products';
import { MachinesPage } from '../pages/machines/machines';
import { DetailsPage } from '../pages/machines/details/details';
import { CallbackPage } from '../pages/callback/callback';
import { GlobalProvider } from '../providers/global/global';
import { DisplaymachinedetailsPage } from '../pages/machines/displaymachinedetails/displaymachinedetails';
import { DisplaytrackdetailsPage } from '../pages/tracking/displaytrackdetails/displaytrackdetails';
import { RegistrationPage } from '../pages/registration/registration';
import { MachinesupdatePage } from '../pages/machines/machinesupdate/machinesupdate';
import { MachinesupdatelistPage } from '../pages/machines/machinesupdatelist/machinesupdatelist';
import { ContactlistPage } from '../pages/contact/contactlist/contactlist';
import { ContacteditPage } from '../pages/contact/contactedit/contactedit';
import { ContactaddPage } from '../pages/contact/contactadd/contactadd';
import { AddresseditPage } from '../pages/address/addressedit/addressedit';
import { AddressaddPage } from '../pages/address/addressadd/addressadd';
import { TicketstatushistoryPage } from '../pages/tracking/ticketstatushistory/ticketstatushistory';
import { JcstatushistoryPage } from '../pages/tracking/jcstatushistory/jcstatushistory';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LoginotpPage,
    RegistrationPage,
    HeaderPage,
    FeedbackPage,
    TrackingPage,
    TicketsPage,
    ProductsPage,
    MachinesPage,
    DetailsPage,
    CallbackPage,
    DisplaymachinedetailsPage,
    DisplaytrackdetailsPage,
    MachinesupdatePage,
    MachinesupdatelistPage,
    ContactlistPage,
    ContacteditPage,
    ContactaddPage,
    AddresseditPage,
    AddressaddPage,
    TicketstatushistoryPage,
    JcstatushistoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    StarRatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    LoginotpPage,
    RegistrationPage,
    HeaderPage,
    FeedbackPage,
    TrackingPage,
    TicketsPage,
    ProductsPage,
    MachinesPage,
    DetailsPage,
    CallbackPage,
    DisplaymachinedetailsPage,
    DisplaytrackdetailsPage,
    MachinesupdatePage,
    MachinesupdatelistPage,
    ContactlistPage,
    ContacteditPage,
    ContactaddPage,
    AddresseditPage,
    AddressaddPage,
    TicketstatushistoryPage,
    JcstatushistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GlobalProvider,
    Geolocation,
    Camera,
    Network
  ]
})
export class AppModule { }
