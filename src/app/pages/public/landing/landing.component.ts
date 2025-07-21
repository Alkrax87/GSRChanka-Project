import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [FontAwesomeModule, NavbarComponent, RouterLink],
  template: `
    <div class="w-full h-screen">
      <div class="relative h-screen">
        <!-- Background -->
        <img loading="lazy" class="absolute inset-0 w-full h-full object-cover z-0" src="https://www.pacuchaglamping.com/wp-content/uploads/2022/09/plaza-andahuaylas.jpeg" alt="MAIN-image">
        <div class="absolute bg-black inset-0 bg-opacity-70 z-10"></div>
        <!-- Top Content -->
        <div class="relative z-20">
          <app-navbar></app-navbar>
        </div>
        <div class="absolute flex flex-col justify-center items-center h-full inset-0 z-10">
          <p class="text-6xl text-white font-semibold">Bienvenidos al GSR<span class="text-main">Chanka</span></p>
          <p class="text-neutral-300 font-semibold">Gestiona tus trámites de manera fácil y rápida. Accede a todos nuestros servicios desde un solo lugar.</p>
          <div class="flex w-1/3 justify-center gap-4 mt-4">
            <button routerLink="/tramite" class="bg-main hover:bg-main-hover text-white font-semibold rounded-full py-3 w-1/2">
              Iniciar Trámite
            </button>
            <button routerLink="/seguimiento" class="bg-white  text-font hover:text-main font-semibold rounded-full py-3 w-1/2">
              Ver Seguimiento
            </button>
          </div>
        </div>
      </div>
    </div>
    <main class="w-full">
      <div>Main Content</div>
    </main>
    <footer class="w-full">
      <div>Footer Content</div>
    </footer>
  `,
  styles: ``,
})
export class LandingComponent {}
