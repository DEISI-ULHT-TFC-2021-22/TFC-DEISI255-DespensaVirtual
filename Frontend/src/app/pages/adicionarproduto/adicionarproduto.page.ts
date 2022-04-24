import { Router } from '@angular/router';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';


@Component({
  selector: 'app-adicionarproduto',
  templateUrl: 'adicionarproduto.page.html',
  styleUrls: ['adicionarproduto.page.scss'],
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

  utilizador: any;

  categoria: String;


  name: String;

  validade = new Date();

  formattedString = '';
  formattedString1 = '';
  numberDays = 0;
  show = false;

  id: any;






  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private alertController: AlertController, private authService: AuthService) {
    this.setToday();
    this.setNumberDays(this.formattedString, this.formattedString1);
  }

  ngOnInit() {
    //Receber o id da pessoa com login


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

  setTitle(title: string) {
    this.title = title
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



}



