import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seguridad',
  imports: [FontAwesomeModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="w-full gap-5 pt-4 sm:pt-10 px-2 sm:px-10 select-none">
      <h2 class="text-main text-center text-3xl font-bold mb-3 md:mb-5"><fa-icon [icon]="Security"></fa-icon> Seguridad</h2>
      <div class="flex flex-col md:flex-row gap-2 md:gap-5">
        <button routerLink="./roles" routerLinkActive="bg-main text-white border-none" class="w-full shadow-md  hover:bg-main hover:text-white hover:border-none py-4 rounded-full font-semibold" type="button">Roles</button>
        <button routerLink="./usuarios" routerLinkActive="bg-main text-white border-none" class="w-full shadow-md  hover:bg-main hover:text-white hover:border-none py-4 rounded-full font-semibold" type="button">Usuarios</button>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: ``
})
export class SeguridadComponent {
  Security = faUserShield;
}
