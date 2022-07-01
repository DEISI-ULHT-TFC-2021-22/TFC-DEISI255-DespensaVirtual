import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfPageRoutingModule } from './conf-routing.module';

import { ConfPage } from './conf.page';
import { SharedComponentsModule } from 'src/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfPageRoutingModule,
    SharedComponentsModule

  ],
  declarations: [ConfPage]
})
export class ConfPageModule {}
