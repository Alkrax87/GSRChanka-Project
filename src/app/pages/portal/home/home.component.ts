import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <div class="relative flex flex-col justify-center items-center p-5 h-full" style="height: calc(100vh - 64px);">
      <h1 class="text-4xl">Bienvenido <span class="text-main font-bold">Paco Bazán</span></h1>
      <div class="absolute bottom-0">
        <img loading="lazy" src="assets/svg/wave.svg" class="w-screen" alt="Wave-SVG">
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeComponent {}
