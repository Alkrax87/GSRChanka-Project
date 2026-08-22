import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Usuario } from '../interfaces/usuario';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private functions = inject(Functions);
  private firestore = inject(Firestore);
  private usuariosCollection = collection(this.firestore, 'usuarios');

  private _usuarios = signal<Usuario[]>([]);
  public usuarios = this._usuarios.asReadonly();

  constructor() {
    this.getUsuarios();
  }

  private getUsuarios() {
    (collectionData(this.usuariosCollection, { idField: 'id' }) as Observable<Usuario[]>).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this._usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  public getUsuario(id: string) {
    const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
    return getDoc(usuarioDoc);
  }

  public async addUsuario(usuario: Usuario) {
    return await httpsCallable(this.functions, 'createUser')(usuario);
  }

  public async updateUsuario(id: string, nombres: string, apellidos: string, abreviatura: string, telefono: string, correo: string, dependenciaId: string) {
    return await httpsCallable(this.functions, 'updateUser')({ uid: id, nombres, apellidos, abreviatura, telefono, correo, dependenciaId });
  }

  public async deleteUsuario(id: string) {
    return await httpsCallable(this.functions, 'deleteUser')({ uid: id });
  }

  public async changePassword(id: string, newPassword: string) {
    return await httpsCallable(this.functions, 'changePassword')({ uid: id, newPassword });
  }

  public async changeRole(id: string, newRole: string) {
    return await httpsCallable(this.functions, 'changeRole')({ uid: id, newRole });
  }

  public changeCounter(id: string, change: number) {
    const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
    getDoc(usuarioDoc).then((doc) => {
      if (doc.exists()) {
        updateDoc(usuarioDoc, { contador: doc.data()['contador'] + change });
      }
    });
  }
}