import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  id: any;
  email: String;
  password: String;


  constructor(private menuCtrl: MenuController, private plt: Platform,private router: Router, 
    private http: HttpClient, private alertController: AlertController) { }

  ngOnInit() {
    
    const width = this.plt.width();
    this.toggleMenu(width);
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
  toggleMenu(width) {
    if (width > 768) {
      this.menuCtrl.enable(false, 'myMenu');
    } else {
      this.menuCtrl.enable(true, 'myMenu');
    }
  }


  pageLoginOrSign(){
    this.router.navigate(['/login'])
  }

  pageListas(){
    this.router.navigate(['/lista'])
  }

  pageCompras(){
    this.router.navigate(['/compras'])
  }

  pageFaq(){
    this.router.navigate(['/faq'])
  }

  pageAdiconarProduto(){
    this.router.navigate(['/adicionarproduto'])

  }

  pageConf(){
    this.router.navigate(['/conf'])
  }
  

}
