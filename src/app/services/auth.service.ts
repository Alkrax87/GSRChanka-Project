import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  async registerUser(email: string, password: string) {
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email + '@gsrchanka.com', password);
  }

  async logOut() {
    const auth = getAuth();
    try {
      await signOut(auth);

      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
