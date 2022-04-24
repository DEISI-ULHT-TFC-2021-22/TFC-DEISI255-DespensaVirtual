import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { AlertController, IonSlides } from '@ionic/angular';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ListaPage implements OnInit {
  @ViewChild('slider') slider: IonSlides;
  @ViewChild("segments") segments;


  categorias = ['Todos','Talho','Frutas','Bebidas','Padaria','Legumes','Peixaria', 'Laticínios','Congelados', 'Charcutaria', 'Outros...'];
  fotografias = ['../../../assets/all.png ',' ../../../assets/meat.png',' ../../../assets/fruit.png','../../../assets/bebidas.png','../../../assets/pao.png ','../../../assets/vegetais.png ', ' ../../../assets/fish.png', '../../../assets/milk.png ','../../../assets/congelados.png ', ' ../../../assets/ham.png','../../../assets/others.png '];

  selectCategoria = 'Todos'
  title = 'Lista de Produtos';
  id: any;
  i = 0;

  allProducts: any;
  ColumnMode = ColumnMode;

  number = 0;

  public data: Data;
  public columns: any;
  public rows: any;
  public bebidas: any;
  public congelados: any;
  public talho: any;


  page: any;
  activeIndex: number;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private alerta: AlertController,
    private router: Router,
    private authService: AuthService
  ) {
    this.columns = [
      { name: 'Produto' },
      { name: 'Quantidade' },
      { name: 'Validade' },
      { name: 'Categoria' },
      { name: '' }
    ];
  }


  ngOnInit() {
    this.receberListas();
  }

  update() {
    this.ngOnInit();
  }
  

  centerButton(event) {
    event.target.scrollIntoView({inline: "center"});
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

  async receberListas() {
    console.log('receber Listas')
    this.authService.getProducts().subscribe(res => {
      console.log('Entrei')
      this.allProducts = res
      console.log(res)
      //Tabela Todas
      this.rows = this.allProducts;

      //Tabela Bebidas
      this.bebidas = this.allProducts.filter(function (produto) {
        return produto.categoria == 'Bebidas';
      })

      //Tabela Congelados
      this.congelados = this.allProducts.filter(function (produto) {
        return produto.categoria == 'Congelados';
      })

    
      //Tabela Talho
      this.talho = this.allProducts.filter(function (produto) {
        return produto.categoria == 'Talho';
      })


    }, error => {
      this.presentedAlert('Não encontrei utilizador', 'Erro do sistema')
    });
  }


  setTitle(title) {
    this.title = title
  }


  async openDetail(nome, quantidade, validade) {
    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: nome,
      message:
        `<p width="100">Quantidade = ${ quantidade }<br><br>Validade = ${ validade } dias<br><br> <img src="../../../assets/login.png"> </p>`,
      buttons: ['OK']

    });
    await alert.present();

  }

  async openQuantity(nome, quantidade) {
    this.number = quantidade
    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: nome,
      message: 'Modificar a quantidades do produto',
      inputs: [
        {
          name: 'number',
          type: 'number',
          placeholder: `${ quantidade }`
        }
      ],
      buttons: [{
        text: 'OK',
        handler: async data => {
          let nomeProduto = nome.toLowerCase()

          if(data.number == "") {
            this.number = this.number;
          }
          else {
            this.number = data.number

          }

          //console.log(nomeProduto)
          const obj = {
            produto: nomeProduto,
            quantidade: `${ this.number }`
          }


          this.authService.changeProductQuantity(obj).subscribe();
          await new Promise(f => setTimeout(f, 500));
          this.update();


        }
      },
      {
        text: 'Cancelar'
      }
      ]

    });

    await alert.present();
  }

  async clickOption($event, nome, quantidade, validade, categoria) {


 
    if ($event.target.value == "editar") {
      this.editar(nome, quantidade, validade, categoria);
    }
    else if ($event.target.value == "remover") {
  
      this.remover(nome)
    }
    else if($event.target.value == "listaCompras"){
      this.colocarLista(nome);
    }

    $event.target.value = ""

  }



  async remover(nome) {
    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: 'Eliminar produto',
      message: `Tem a certeza que deseja remover o seguinte produto: ${ nome }`,
      buttons: [{
        text: 'OK',
        handler: async data => {
          const obj = {
            produto: nome,
          }
          this.authService.removerProduct(obj).subscribe();
          await new Promise(f => setTimeout(f, 500));

          this.update();
          alert.dismiss();
        },
      },
      {
        text: 'Cancelar'
      }
      ]

    });

    await alert.present();
  }

  //Fica a faltar criar as funções
  async editar(nome, quantidade, validade, categoria) {


    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: 'Editar produto',
      message: nome,
      inputs: [
        {
          name: 'nome',
          placeholder: `${ nome }`

        },
        {
          name: 'quantidade',
          type: 'number',
          placeholder: `${ quantidade }`
        },
        {
          name: 'validade',
          type: 'number',
          placeholder: `${ validade } dias`
        },
        {
          name: 'categoria',
          placeholder: `${ categoria }`,
          //type: this.categorias
        }

      ],
      buttons: [{
        text: 'OK',
        handler: async data => {
          const novoNome = data.nome;
          const quantidade = data.quantidade;
          const validade = data.validade;
          const categoria = data.categoria;

          let obj = {}
          if(novoNome!="" && quantidade!="" && validade!="" && categoria!="") {
            console.log('1')
            obj = {
              produto: nome,
              novoNome: `${novoNome}`,
              validade: `${validade}`,
              quantidade: `${ quantidade }`,
              categoria: `${categoria}`
            }
          }
          else if(novoNome!="" && quantidade!="" && validade!="" && categoria=="") {
            console.log('2')

            obj = {
              produto: nome,
              novoNome: `${novoNome}`,
              validade: `${validade}`,
              quantidade: `${ quantidade }`,
            }
          }
          else if(novoNome!="" && quantidade!="" && validade=="" && categoria=="") {
            console.log('3')

            obj = {
              produto: nome,
              novoNome: `${novoNome}`,
              quantidade: `${ quantidade }`,
            }
          }
          else if(novoNome!="" && quantidade=="" && validade=="" && categoria=="") {
            console.log('4')

            obj = {
              produto: nome,
              novoNome: `${novoNome}`,
            }
          }
          else if(novoNome=="" && quantidade!="" && validade!="" && categoria!="") {
            console.log('5')

            obj = {
              produto: nome,
              validade: `${validade}`,
              quantidade: `${ quantidade }`,
              categoria: `${categoria}`
            }
          }
          else if(novoNome=="" && quantidade=="" && validade!="" && categoria!="") {
            console.log('6')

            obj = {
              produto: nome,
              validade: `${validade}`,
              categoria: `${categoria}`
            }
          }
          else if(novoNome=="" && quantidade=="" && validade=="" && categoria!="") {
            console.log('7')

            obj = {
              produto: nome,
              categoria: `${categoria}`
            }
          }
          else if(novoNome=="" && quantidade!="" && validade=="" && categoria=="") {
            console.log('8')

            obj = {
              produto: nome,
              quantidade: `${ quantidade }`,
            }
          }
          

          console.log(obj)
          //Com novo nome e categoria está feito
          this.authService.changeProduct(obj).subscribe();
          await new Promise(f => setTimeout(f, 500));

          this.update();
          alert.dismiss();

        },
      },
      {
        text: 'Cancelar'
      }
      ]

    });

    await alert.present();

  }

  //Fica a faltar criar as funções
  async colocarLista(nome) {


    const obj = {
      produto: nome,
    }
    this.authService.changeProductList(obj).subscribe();

  }





}



//Botao de Açção vai ser modificado para Info() na qual aparece a informaçao sobre o produto com 3 botoes('ok', 'Coloacar lista de compras' , 'Remover')
// E assim para editar o produto só tenho de carregar na respetiva informação

