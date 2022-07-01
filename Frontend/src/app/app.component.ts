import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor( 
    private platform: Platform,
    private authService: AuthService,
    private router: Router) {
    this.initializeApp();

  }



  initializeApp() {
    this.platform.ready().then(() => {
 
      this.authService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['/menu']);
        } else {
          this.router.navigate(['/login']);
        }
      });
 
    });
  }
}
