import { Component, OnInit, Input } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-recargas',
  templateUrl: './recargas.page.html',
  styleUrls: ['./recargas.page.scss'],
})
export class RecargasPage implements OnInit {
  auxRecarga: any;
  @Input() creditoActual;
  idDocCurrentUser: any;
  qrdate = null;
  respuestaDelScan = null;
  codRecarga10 = { codigo: "8c95def646b6127282ed50454b73240300dccabc", valor: 10, nombreDelCampo: "codigo10" };
  codRecarga50 = { codigo: "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ", valor: 50, nombreDelCampo: "codigo50" };
  codRecarga100 = { codigo: "2786f4877b9091dcad7f35751bfcf5d5ea712b2f", valor: 100, nombreDelCampo: "codigo100" };
  recargaActual: any;
  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private toast: ToastController) {
  }

  ngOnInit() {
    this.firestoreService.obtenerTodos('recargas').subscribe((recargasSnapShot) => {//me traigo toda la lista de recargas
      recargasSnapShot.forEach((response: any) => {
        let informacionDeRecarga = response.payload.doc.data();//vuelco la informacion de la recarga en la variable
        if (informacionDeRecarga.usuario == this.authService.currentUser.email) {//busco la informacion del usuario actual
          this.idDocCurrentUser = response.payload.doc.id;//guardo el id del doc en mi variable
          this.auxRecarga = informacionDeRecarga;
        }
      });
      if (this.auxRecarga == undefined)//si ingresa por primera vez seteo todo por default
      {
        this.auxRecarga = {
          "codigo10": "",
          "codigo50": "",
          "codigo100": "",
          "usuario": this.authService.currentUser.email,
          "saldo": 0
        }
        this.firestoreService.crear('recargas', this.auxRecarga);//lo guardo en firebase
      }
      this.creditoActual = this.auxRecarga['saldo'];
    });
  }


  scanCode() {
    BarcodeScanner.scan().then(barcodeData => {

      switch (barcodeData.text) {//es el contenido del codigo QR leido
        case this.codRecarga10.codigo:
          this.recargaActual = this.codRecarga10;
          break;
        case this.codRecarga50.codigo:
          this.recargaActual = this.codRecarga50;
          break;
        case this.codRecarga100.codigo:
          this.recargaActual = this.codRecarga100;
          break;
        default:
          this.recargaActual = { codigo: "", valor: 0, nombreDelCampo: "null" };
          break;
      }

      if (this.recargaActual.valor != 0) {
        this.recargarCredito();
      }
      else {
        this.presentToast("Código inexistente", "ERROR, el codigo no coincide con ninguno de los almacenado, intente de nuevo", 'danger');
      }
    });
  }
  async presentToast(header: string, message: string, color: string) {
    const toast = await this.toast.create({
      header,
      message,
      color,
      duration: 2000,
      position: "middle"
    });
    toast.present();
  }
  reiniciarCreditos() {
    if (this.authService.currentUser.email == "admin@admin.com") {
      this.firestoreService.actualizar('recargas', this.idDocCurrentUser, {
        "codigo10": "",
        "codigo50": "",
        "codigo100": "",
        "codigo10A": "",
        "codigo50A": "",
        "codigo100A": "",
        "usuario": this.authService.currentUser.email,
        "saldo": 0
      });
    }
    else {
      this.firestoreService.actualizar('recargas', this.idDocCurrentUser, {
        "codigo10": "",
        "codigo50": "",
        "codigo100": "",
        "usuario": this.authService.currentUser.email,
        "saldo": 0
      });
    }
    this.presentToast("Reinicio exitoso", "Se han reiniciado los creditos", "success");
  }
  recargarCredito() {


    if (this.auxRecarga[this.recargaActual.nombreDelCampo] == "")//verifico que no tenga hecha esa recarga
    {
      this.auxRecarga[this.recargaActual.nombreDelCampo] = this.recargaActual.codigo;
      this.auxRecarga["saldo"] += this.recargaActual.valor;
      this.presentToast("Recarga exitosa", "Tu recarga de " + this.recargaActual.valor + " fue realizada con exito", "success");
    }
    else {
      if (this.authService.currentUser.email == "admin@admin.com" && this.auxRecarga[this.recargaActual.nombreDelCampo + "A"] == "")//verifico si es administrador y le permito hacer otra recarga si aun no hizo la segunda recarga
      {
        this.auxRecarga[this.recargaActual.nombreDelCampo + "A"] = this.recargaActual.codigo;//uso la recarga especial A
        this.auxRecarga["saldo"] += this.recargaActual.valor;
        this.presentToast("Recarga exitosa", "Tu segunda recarga de " + this.recargaActual.valor + " fue realizada con exito", "success");
      }
      else {
        this.presentToast("Multiples recargas", "Ya has agotado tus recargas de " + this.recargaActual.valor, "warning");
      }
    }
    this.firestoreService.actualizar("recargas", this.idDocCurrentUser, this.auxRecarga);
    this.creditoActual = this.auxRecarga['saldo'];
  }

}
