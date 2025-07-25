import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  template: `
    <div class="w-full h-screen flex items-center justify-center">
      <button (click)="logOut()" class="bg-red-600 hover:bg-opacity-90 text-white border rounded-full px-4 py-2 outline-none">
        Cerrar Sesión
      </button>
    </div>
  `,
  styles: ``,
})
export class MainComponent {
  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.logOut();
  }
}