import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MachinesPage } from '../machines/machines';

@NgModule({
  declarations: [
    MachinesPage,
  ],
  imports: [
    IonicPageModule.forChild(MachinesPage),
  ],
})
export class HomePageModule {}
