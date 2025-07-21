import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  template: `
    <header class="py-4 px-16">
      <nav class="bg-white text-font rounded-full flex justify-between py-2 px-4">
        <!-- Branding -->
        <div routerLink="" class="flex items-center gap-2 cursor-pointer">
          <img src="https://pbs.twimg.com/profile_images/1223279373542993920/rtXA6v2o_200x200.jpg" width="40px" alt="MAIN-logo">
          <p class="text-xl font-bold">GSR<span class="text-main font-semibold">Chanka</span></p>
        </div>
        <!-- Options -->
        <div class="flex items-center gap-2 text-sm">
          <div routerLink="/tramite" [routerLinkActive]="'text-main'" class="hover:text-main cursor-pointer py-2 px-2 outline-none">
            Trámite
          </div>
          <div routerLink="/seguimiento" [routerLinkActive]="'text-main'" class="hover:text-main cursor-pointer py-2 px-2 outline-none">
            Seguimiento
          </div>
          <div routerLink="/login" class="bg-main hover:bg-main-hover text-white font-semibold px-4 py-2 rounded-full cursor-pointer outline-none">
            <fa-icon [icon]="Login"></fa-icon> &nbsp;&nbsp;Login
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: ``,
})
export class NavbarComponent {
  Login = faRightToBracket;
}
