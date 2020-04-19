import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {



  constructor(private firestore: AngularFirestore) {
  }

  //Crea un nuevo dato
  public crear(collection: string, data: { name: string, message: string, date: string }) {
    return this.firestore.collection(collection).add(data);
  }
  //Obtiene un datoS
  public obtener(documentId: string) {
    return this.firestore.collection('messages').doc(documentId).snapshotChanges();
  }
  //Obtiene todos los datos
  public obtenerTodos(collection) {
    return this.firestore.collection(collection).snapshotChanges();
  }
  //Actualiza un dato
  public actualizar(collection: string, documentId: string, data: any) {
    return this.firestore.collection(collection).doc(documentId).set(data);
  }

}
