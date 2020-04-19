import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'src/app/clases/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isLogged: any = false;
  public currentUser: any;
  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => (this.isLogged = user));
  }
  //LOGIN
  async OnLogin(user: User) {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
    } catch (error) {
      console.log('ERROR al logear ', error);
    }
  }
  //REGISTER
  async OnRegister(user: User) {
    try {
      return await this.afAuth.auth.createUserWithEmailAndPassword(user.email,
        user.password
      );
    } catch (error) {
      console.log('ERROR al registrar usuario ', error);
    }
  }

}
