import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdicionarprodutoPageRoutingModule } from './adicionarproduto-routing.module';

import { AdicionarprodutoPage } from './adicionarproduto.page';
import { SharedComponentsModule } from 'src/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarprodutoPageRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule
  ],
  declarations: [AdicionarprodutoPage]
})
export class AdicionarprodutoPageModule {}
