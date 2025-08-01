import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="w-full h-screen flex flex-col items-center justify-center">
      <button (click)="logOut()" class="bg-red-600 hover:bg-opacity-90 text-white border rounded-full px-4 py-2 outline-none">
        Cerrar Sesión
      </button>
    </div>
  `,
  styles: ``
})
export class HomeComponent {
  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.logOut();
  }
}
