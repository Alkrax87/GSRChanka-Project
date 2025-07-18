import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth) {}

  async registerUser(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }
}
