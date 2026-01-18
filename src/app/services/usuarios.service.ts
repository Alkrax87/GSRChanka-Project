import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private firestore = inject(Firestore);
  usuariosCollection = collection(this.firestore, 'usuarios');

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

  public addUsuario(usuario: Usuario) {
    const usuarioDoc = doc(this.usuariosCollection, usuario.id);
    return setDoc(usuarioDoc, usuario);
  }

  public updateUsuario(id: string, usuario: Partial<Usuario>) {
    const usuarioDoc= doc(this.firestore, `usuarios/${id}`);
    return updateDoc(usuarioDoc, usuario);
  }

  public deleteUsuario(id: string) {
    const usuarioDoc = doc(this.firestore, `usuarios/${id}`);
    return deleteDoc(usuarioDoc);
  }
}