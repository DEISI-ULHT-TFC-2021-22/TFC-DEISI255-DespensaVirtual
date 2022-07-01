import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BarcodeScanner,  CameraDirection} from '@capacitor-community/barcode-scanner';
import { AlertController, LoadingController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-adicionarproduto',
  templateUrl: './adicionarproduto.page.html',
  styleUrls: ['./adicionarproduto.page.scss'],
})
export class AdicionarprodutoPage implements OnInit {
  ver: boolean = false;
  number = 1;
  title = "Adicionar Produto";
  modes = ['date', 'month', 'month-year', 'year'];
  selectedMode = 'date';
  showPicker = false;
  showPicker1 = false;
  dateValue = format(new Date(), 'yyyy-MM-dd');
  dateValue1 = format(new Date(), 'yyyy-MM-dd');

  scanActive: boolean = false;
  code: any;
  picture: String;
  imagem = null;
  utilizador: any;

  categoria: String;

  fotografia: ImageData;

  name: any;

  validade = new Date();

  formattedString = '';
  formattedString1 = '';
  numberDays = 0;
  numero = 0;

  show = false;

  id: any;

  constructor(private alertController: AlertController, public loadingController: LoadingController,    private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.setToday();
    this.setNumberDays(this.formattedString, this.formattedString1);
  }

  ngOnInit() {
    
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

  setNumberDays(formattedString: string, formattedString1: string) {

    const data1 = formattedString.split('-');
    const dia1 = data1[0];
    const mes1 = data1[1];
    const ano1 = data1[2];
    const data2 = formattedString1.split('-');
    const dia2 = data2[0];
    const mes2 = data2[1];
    const ano2 = data2[2];



    if (formattedString == formattedString1) {
      this.numberDays = 0;
    }
    else {

      var este = mes1 + '/' + dia1 + '/' + ano1
      var este1 = mes2 + '/' + dia2 + '/' + ano2

      var date1 = new Date(este);
      var date2 = new Date(este1);

      this.validade = date2;

      var Difference_In_Time = date2.getTime() - date1.getTime();

      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      this.numberDays = Math.round(Difference_In_Days);

    }

    if (this.numberDays < 0) {
      this.numberDays = 0
    }

    console.log(this.numberDays)

  }

  setToday() {
    this.formattedString = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'dd-MM-yyyy');
    this.formattedString1 = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'dd-MM-yyyy');

  }


  dateChanged(value) {
    console.log(value)
    this.dateValue = format(parseISO(value), 'dd-MM-yyyy');;
    this.formattedString = format(parseISO(value), 'dd-MM-yyyy');
    this.showPicker = false
  }


  dateChanged1(value) {
    console.log(value)
    this.dateValue1 = value;
    this.formattedString1 = format(parseISO(value), 'dd-MM-yyyy');
    this.showPicker1 = false
  }


  modificarDataValidade(dias) {
    this.formattedString1 = format(parseISO(this.validade + dias), 'dd-MM-yyyy');
    console.log(this.formattedString1)
  }



  Aumentar() {
    this.number++;
  }

  Diminuir() {
    if (this.number == 1) {
      this.number = 1;
    }
    else {
      this.number--;
    }
  }

  verificar(e: { ver: boolean; }) {
    e.ver = !e.ver;
  }

  async changeNumber() {
    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: 'Modificar a quantidades do produto',
      inputs: [
        {
          name: 'number',
          type: 'number',
          placeholder: `${ this.number }`
        }
      ],
      buttons: [{
        text: 'OK',
        handler: data => {
          console.log(data)

          if (data.number.toString() == "") {
            console.log('entrei')
            this.number = 1;
          }
          else {
            this.number = data.number
          }
        }

      },
      {
        text: 'Cancelar'

      }
      ]

    });

    await alert.present();
  }

  async openDetail() {
    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: 'BarCode',
      message: 'Coloque o serial number',
      inputs: [
        {
          name: 'barcode',
          type: 'number',
          placeholder: ''
        }
      ],
      buttons: [{
        text: 'OK',
        handler: async data => {
          this.numero = data.barcode
        

          //console.log(nomeProduto)
          const obj = {
            barcode : this.numero
          }

          const loading = await this.getLoadingIndicator();

          //console.log(obj)
          this.authService.receberNome(obj).subscribe(res => {

            console.log(res)
            
            const nomeProduto = res['nome'];
            this.name = nomeProduto;
            this.imagem = res['imagem']
            console.log(this.name)
            
          }, error => {
            console.log(error)
          });
          await new Promise(f => setTimeout(f, 500));
          loading.dismiss();

        }
      },
      {
        text: 'Cancelar'
      }
      ]

    });

    await alert.present();
  }

  async getLoadingIndicator() {
    const loading = await this.loadingController.create({
        message: 'Please wait...'
    });
    loading.present();
    return loading;
}


  Adicionar() {


    if (this.name == null || this.number == 0 || this.categoria == null) {
      this.presentedAlert('Não foi possível', 'Falta preencher campos')

    }
    else {
      let produto = {
        produto: this.name.toLowerCase(),
        quantidade: this.number,
        validade: this.numberDays,
        categoria: this.categoria
      }
      this.authService.addProduct(produto).subscribe(res => {
        //format.reset();
        this.router.navigateByUrl('adicionarproduto', { replaceUrl: true })
        console.log('Produto enviado')
        this.name = "";
        this.number = 1;
        this.categoria = null;
        this.numberDays = 0;

      }, (error: any) => {
        console.log('Produto falhado')
        this.presentedAlert('Produto falhado', 'Erro do sistema')
      })

      //tenho de veriridicar se ja existe produto na base de dados

    }

  }

  async changeValidade() {
    const alert = await this.alertController.create({
      cssClass: 'alertaProdutos',
      header: 'Modificar a validade do produto',
      inputs: [
        {
          name: 'number',
          type: 'number',
          placeholder: `${ this.numberDays }`
        }
      ],
      buttons: [{
        text: 'OK',
        handler: data => {
          //Fica a faltar modificar a data de validade quando mudamos a quantidade
          this.numberDays = data.number
          var myCurrentDate = new Date();
          var new_date = moment(myCurrentDate, "DD-MM-YYYY").add(data.number, 'days');
          this.formattedString1 = new_date.format("DD-MM-YYYY")

        }

      },
      {
        text: 'Cancelar'

      }
      ]

    });

    await alert.present();
  }


  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'No Permission',
          message: 'Please allow camera access in your settings.',
          buttons: [
            { text: 'No', role: 'cancel' },
            {
              text: 'Open Settings',
              handler: () => {
                BarcodeScanner.openAppSettings();
                resolve(false);
              },
            },
          ],
        });
        await alert.present();
      } else {
        resolve(false);
      }
    });
  }


  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan({ cameraDirection: CameraDirection.BACK});

      this.code = result;

      if (result.hasContent) {
        this.scanActive = false;
        console.log(result.content)
        alert(result.content); 
        const loading = await this.getLoadingIndicator();

        //console.log(nomeProduto)
        const obj = {
          barcode : this.code
        }
          //console.log(obj)
        this.authService.receberNome(obj).subscribe(res => {

            
        const nomeProduto = res['nome'];
        this.name = nomeProduto;
        this.imagem = res['imagem']
      }, error => {
        console.log(error)
      })
      loading.dismiss();


      } else {
        alert('NO DATA FOUND!');
      }
    } else {
      alert('NOT ALLOWED!');
    }

  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
}