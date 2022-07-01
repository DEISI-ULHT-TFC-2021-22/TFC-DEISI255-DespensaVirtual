import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPageRoutingModule } from './lista-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ListaPage } from './lista.page';
import { SharedComponentsModule } from 'src/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPageRoutingModule,
    NgxDatatableModule,
    SharedComponentsModule
  ],
  declarations: [ListaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ListaPageModule {}
