import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({
      "Authorization": "Bearer "
    })
  };
  url = environment.api_url;
  user = null;
  authenticationState = new BehaviorSubject(false);

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage,
    private plt: Platform, private alertController: AlertController) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
        }
      }
    });
  }

  register(credentials) {
    return this.http.post(`${ this.url }/register`, credentials).pipe(
      catchError(e => {
        //console.log(credentials)
        this.showAlert(e.error.msg);
        throw new Error(e);
      })

    );
  }

  login(credentials) {
    return this.http.post(`${ this.url }/login`, credentials)
      .pipe(
        tap(res => {
          console.log('Entrei')

          this.storage.set(TOKEN_KEY, res['token']);
          this.httpOptions.headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('authorization', 'Bearer ' + res['token']);
          console.log(res['token'])
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
          //Token = jwt
        }),
        map(n => {
          this.showAlert1('O seu login foi realizado com sucesso', 'Bem vindo')
        }),
        catchError(e => {
          console.log('Nao entrei')
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getSpecialData() {
    return this.http.get(`${ this.url }/special`).pipe(
      catchError(e => {
        let status = e.status;
        if (status === 401) {
          this.showAlert('You are not authorized for this!');
          this.logout();
        }
        throw new Error(e);
      })
    )
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }



  getProducts() {
    console.log(this.httpOptions)
    //console.log(this.user)
    //console.log(this.storage.get('access_token'))
    //console.log(this.httpOptions)
    return this.http.get(`${ this.url }/user/products`, this.httpOptions)
      .pipe(
        catchError(e => {
          let status = e.status;
          console.log(e)
          if (status === 401) {
            this.showAlert('You are not authorized for this!');
            this.logout();
          }
          throw new Error(e);
        })
      )


  }



  addProduct(product) {
    return this.http.post(`${ this.url }/user/products/create`, product, this.httpOptions)
      .pipe(
        map(n => {
          this.showAlert1('O produto foi adicionado à sua lista de produtos', 'Sucesso')
        }),
        catchError(e => {
          console.log(product)
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      );
  }

  removerProduct(product) {
    return this.http.post(`${ this.url }/user/products/remove`, product, this.httpOptions)
      .pipe(
        map(n => {
          this.showAlert1('O produto foi removido da sua lista', 'Sucesso')
        }),
        catchError(e => {
          console.log('oioi')
          console.log(product)
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      );
  }


  changeProductQuantity(product) {
    console.log(this.httpOptions)

    return this.http.put(`${ this.url }/user/products/editQuantidade`, product, this.httpOptions)
      .pipe(
        map(n => {
          this.showAlert1('O produto foi editado', 'Sucesso')
        }),
        catchError(e => {
          console.log("Falhou1")
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      )
  }

  changeProduct(product) {
    console.log(this.httpOptions)

    return this.http.put(`${ this.url }/user/products/edit`, product, this.httpOptions)
      .pipe(
        map(n => {
          this.showAlert1('O produto foi editado', 'Sucesso')
        }),
        catchError(e => {
          console.log("Falhou2")
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      )
  }

  changeProductList(product) {
    console.log(this.httpOptions)
    return this.http.put(`${ this.url }/user/products/editList`, product, this.httpOptions)
      .pipe(
        catchError(e => {
          console.log("Falhou3")
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      )
  }


  receberNome(product) {
    console.log(product)
    return this.http.post(`${ this.url }/user/products/barcode`, product)
    .pipe(
      catchError(e => {
        console.log("Falhou4")
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    )
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
  showAlert1(msg, header) {
    let alert = this.alertController.create({
      message: msg,
      header: header,
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

}



