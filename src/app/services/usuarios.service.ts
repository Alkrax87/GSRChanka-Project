import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'usuarios');

  getUsers(): Observable<Usuario[]> {
    return collectionData(this.usersCollection, { idField: 'id' }) as Observable<Usuario[]>;
  }

  addUser(user: Usuario) {
    return addDoc(this.usersCollection, user);
  }

  updateUser(id: string, user: Partial<Usuario>) {
    const userDoc= doc(this.firestore, `usuarios/${id}`);
    return updateDoc(userDoc, user);
  }

  deleteUser(id: string) {
    const userDoc = doc(this.firestore, `usuarios/${id}`);
    return deleteDoc(userDoc);
  }
}