import { inject, Injectable, signal } from '@angular/core';
import { Auth, browserSessionPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthUser } from '../interfaces/auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  private _usuariologged = signal<AuthUser | null>(null);
  public usuarioLogged = this._usuariologged.asReadonly();

  constructor() {
    this.listenAuthChanges();
  }

  private listenAuthChanges() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const claims: any = (await user.getIdTokenResult(true)).claims;

        this._usuariologged.set({
          uid: user.uid,
          username: user.email!.split('@')[0],
          displayName: user.displayName!,
          role: claims['rol'],
          dependenciaId: claims['dependenciaId'],
        });
      } else {
        this._usuariologged.set(null);
      }
    });
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