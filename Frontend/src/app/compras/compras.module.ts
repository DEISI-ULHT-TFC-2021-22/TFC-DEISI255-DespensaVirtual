import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComprasPageRoutingModule } from './compras-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ComprasPage } from './compras.page';
import { SharedComponentsModule } from 'src/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComprasPageRoutingModule,
    NgxDatatableModule,
    SharedComponentsModule

  ],
  declarations: [ComprasPage]
})
export class ComprasPageModule {}
