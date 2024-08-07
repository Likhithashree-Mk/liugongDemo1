import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContacteditPage } from './contactedit';

@NgModule({
  declarations: [
    ContacteditPage,
  ],
  imports: [
    IonicPageModule.forChild(ContacteditPage),
  ],
})
export class ContacteditPageModule {}
