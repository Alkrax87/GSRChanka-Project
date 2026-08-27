import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="relative flex flex-col justify-center items-center p-5 h-full" style="height: calc(100vh - 64px);">
      @if (currentUser()) {
        <h1 class="text-4xl animate-fade-up delay-75">
          Bienvenido <span class="text-main font-bold">{{ currentUser()?.displayName }}</span>
        </h1>
      }
      <div class="absolute bottom-0">
        <img loading="lazy" src="assets/svg/wave.svg" class="w-screen" alt="Wave-SVG" />
      </div>
    </div>
  `,
  styles: `
    @keyframes fadeUp {
      0% {
        opacity: 0;
        transform: translateY(50px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-up {
      animation: fadeUp 1s ease-out forwards;
    }
  `,
})
export class HomeComponent {
  currentUser = inject(AuthService).usuarioLogged;
}