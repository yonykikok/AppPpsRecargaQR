import { Component, OnInit, Input, Output } from '@angular/core';
import { User } from 'src/app/clases/user';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: User = new User();
  ingresar = false;
  escanear=false;
  usuarios = [{ id: 1, email: "admin@admin.com", password: 111111, perfil: "admin", sexo: "femenino" },
  { id: 2, email: "invitado@invitado.com", password: 222222, perfil: "invitado", sexo: "femenino" },
  { id: 3, email: "usuario@usuario.com", password: 333333, perfil: "usuario", sexo: "masculino" },
  { id: 4, email: "anonimo@anonimo.com", password: 444444, perfil: "usuario", sexo: "masculino" },
  { id: 5, email: "tester@tester.com", password: 555555, perfil: "tester", sexo: "femenino" }];
  usuarioSeleccionado:User;
  constructor(private authService: AuthService, private router: Router) {
    this.usuarioSeleccionado = new User();

  }
  ngOnInit() {
  }

  cargarUsuarioEnInput($usuario) {
    this.escanear=true;
    setTimeout(() => {
    this.escanear=false;
      
    }, 4000);
    this.usuarioSeleccionado = $usuario;

  }
  async OnLogin() {
    this.ingresar = true;
    setTimeout(() => {
    this.ingresar = false;
    }, 3000);
    const response = await this.authService.OnLogin(this.user);
    if (response) {
      this.authService.currentUser=response.user;
      setTimeout(() => {
        this.router.navigateByUrl('/recargas');
      }, 1500);
    }
  }
}
