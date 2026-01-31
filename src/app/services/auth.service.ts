import { inject, Injectable, signal } from '@angular/core';
import { Auth, browserSessionPersistence, createUserWithEmailAndPassword, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  private _usuariologged = signal<Usuario | null>(null);
  public usuarioLogged = this._usuariologged.asReadonly();

  constructor() {
    this.listenAuthChanges();
  }

  private listenAuthChanges() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this._usuariologged.set(null);
      }
    });
  }

  private async loadUserData(uid: string) {
    const userRef = doc(this.firestore, `usuarios/${uid}`);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
      this._usuariologged.set({
        id: snapshot.id,
        ...snapshot.data(),
      } as Usuario);
    } else {
      this._usuariologged.set(null);
    }
  }

  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    await setPersistence(this.auth, browserSessionPersistence)
    return signInWithEmailAndPassword(this.auth, email + '@gsrchanka.com', password);
  }

  async logOut() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}