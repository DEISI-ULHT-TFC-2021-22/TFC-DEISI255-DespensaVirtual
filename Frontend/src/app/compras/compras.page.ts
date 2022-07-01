import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

import { IProducts, Products } from './products.model';


@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  title = 'Lista de Compras';
  public rows: any;


  public allProducts: Array<IProducts> = [];
  public foraLista: Array<IProducts>  = [];
  public listaCompra: Array<IProducts>  = [];


  constructor(
    private alertController: AlertController,
    private authService: AuthService,
    public loadingController: LoadingController
    ) 
    {}
    
  ngOnInit() {
    this.receberListas();
  }

  async receberListas() {
    this.allProducts = []
    this.listaCompra = []
    this.foraLista = []
    const loading = await this.getLoadingIndicator();
    this.authService.getProducts().subscribe((res: any) => {

      this.allProducts = res;
      let foraListaTemp = this.allProducts.filter((produto) => {
        return produto.lista_compras === false;
      })
      this.foraLista = [...foraListaTemp]

      let listaCompraTemp = this.allProducts.filter((produto) => {
        return produto.lista_compras === true;
      })
      this.listaCompra = [...listaCompraTemp]
  
      loading.dismiss();
    }, (error: HttpErrorResponse) => {
      this.presentedAlert('Não encontrei utilizador', 'Erro do sistema')
      loading.dismiss();
      console.log(error.message)
    });
  }


  async presentedAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

  }

  async getLoadingIndicator() {
    const loading = await this.loadingController.create({
        message: 'Please wait...'
    });
    loading.present();
    return loading;
  
  }

  update() {
    this.ngOnInit();
  }



  async change(nome, valor){

    const obj = {
      produto: nome,
    }

    this.authService.changeProductList(obj).subscribe();
    await new Promise(f => setTimeout(f, 500));


    
    this.update();

  }


}
