import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactaddPage } from './contactadd';

@NgModule({
  declarations: [
    ContactaddPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactaddPage),
  ],
})
export class ContactaddPageModule {}
