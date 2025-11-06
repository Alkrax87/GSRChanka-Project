import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'usuarios');

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  dataUsuario$ = this.usuarioSubject.asObservable();

  async getUserLoggedData() {
    this.usuarioSubject.next(null);
    const uid = this.authService.getUserUid();

    if (!uid) return;

    const snapshot = await getDoc(doc(this.firestore, `usuarios/${uid}`));
    this.usuarioSubject.next(snapshot.data() as Usuario);
  }

  getUsers(): Observable<Usuario[]> {
    return collectionData(this.usersCollection, { idField: 'id' }) as Observable<Usuario[]>;
  }

  addUser(user: Usuario) {
    const userDoc = doc(this.usersCollection, user.id);
    return setDoc(userDoc, user);
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