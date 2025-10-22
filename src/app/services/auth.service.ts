import { Injectable } from '@angular/core';
import { Auth, browserSessionPersistence, createUserWithEmailAndPassword, setPersistence, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  registerUser(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return setPersistence(this.auth, browserSessionPersistence).then(() => {
      return signInWithEmailAndPassword(this.auth, email + '@gsrchanka.com', password);
    });
  }

  async logOut() {
    try {
      await signOut(this.auth);

      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}