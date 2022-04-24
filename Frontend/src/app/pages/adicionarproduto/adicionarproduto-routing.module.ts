import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdicionarprodutoPage } from './adicionarproduto.page';

const routes: Routes = [
  {
    path: '',
    component: AdicionarprodutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdicionarprodutoPageRoutingModule {}
