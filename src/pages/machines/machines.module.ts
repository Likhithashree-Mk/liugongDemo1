import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachinesPage } from './machines';

@NgModule({
  declarations: [
    MachinesPage,
  ],
  imports: [
    IonicPageModule.forChild(MachinesPage),
  ],
})
export class MachinesPageModule {}
