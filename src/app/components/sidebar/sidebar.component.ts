import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faArrowRightFromBracket, faBuilding, faHome, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex flex-col w-64 bg-neutral-800 h-[100vh] p-2 fixed left-0 top-0 text-white z-50">
      <!-- Title -->
      <div [routerLink]="'./home'" class="flex items-center h-12 p-2 gap-2 hover:bg-neutral-700 duration-200 rounded-lg cursor-pointer">
        <img src="https://placehold.co/32x32" alt="BRAND-logo" class="rounded-md w-8 h-8">
        <p><span class="font-bold">GSR</span>Chanka</p>
      </div>
      <!-- Content -->
      <div class="bg-neutral-700 h-0.5 rounded-full my-2"></div>
      <div class="flex flex-col gap-4 h-full">
        @for (section of sections; track $index) {
          <div>
            <p class="text-neutral-500 text-xs px-2 mb-1">{{ section.sectionName }}</p>
            <div class="flex flex-col gap-1">
              @for (route of section.routes; track $index) {
                @if (!route.multiRoutes) {
                  <div class="flex gap-2 cursor-pointer pl-4 pr-2 py-2 -ml-2 hover:bg-main rounded-r-full text-sm duration-300" [routerLink]="route.route" [routerLinkActive]="['bg-main']" (click)="resetSubRoutesStatus()">
                    <fa-icon [icon]="route.icon"></fa-icon>
                    <p class="w-full">{{ route.name }}</p>
                  </div>
                } @else {
                  <div class="flex gap-2 cursor-pointer pl-4 pr-2 py-2 -ml-2 hover:bg-main rounded-r-full text-sm duration-300" [routerLink]="route.route" [routerLinkActive]="['bg-main']" (click)="route.subRoutesStatus = !route.subRoutesStatus">
                    <fa-icon [icon]="route.icon"></fa-icon>
                    <p class="w-full">{{ route.name }}</p>
                    @if (route.subroutes) {
                      <fa-icon class="text-center w-8 duration-300" [icon]="ArrowDown" [ngClass]="{ 'rotate-180' : route.subRoutesStatus}"></fa-icon>
                    }
                  </div>
                  @if (route.subRoutesStatus) {
                    <div class="text-sm">
                      @for (subroute of route.subroutes; track $index) {
                        <div class="border-l-2 border-neutral-700 ml-3.5 pl-3 duration-200 hover:text-main hover:border-l-main h-8 flex items-center cursor-pointer" [routerLink]="subroute.route" [routerLinkActive]="['text-main', 'border-l-main']">
                          {{ subroute.name }}
                        </div>
                      }
                    </div>
                  }
                }
              }
            </div>
          </div>
        }
      </div>
      <div class="bg-neutral-700 h-0.5 rounded-full my-2"></div>
      <!-- User -->
      <div class="flex items-center h-12 p-2 gap-2">
        <img src="https://placehold.co/32x32" alt="USER-logo" class="rounded-md w-8 h-8">
        <div class="flex flex-col w-full truncate">
          <p class="font-semibold text-sm -mb-1 truncate">{{ user.name + ' ' + user.lastname }}</p>
          <p class="text-xs">{{ user.username }}</p>
        </div>
        <div class="flex items-center justify-center">
          <button class="hover:bg-white hover hover:text-neutral-800 duration-300 rounded-lg w-8 h-8">
            <fa-icon [icon]="LogOut"></fa-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class SidebarComponent {
  user: { name: string, lastname: string, username: string } = {
    name: 'John',
    lastname: 'Doe',
    username: 'jdoe',
  }

  sections = [
    {
      sectionName: 'Admin',
      routes: [
        {
          name: 'Inicio',
          icon: faHome,
          route: './home',
        },
        {
          multiRoutes: true,
          name: 'Usuario',
          icon: faUser,
          route: './usuario',
          subroutes: [
            { name: 'Lista', route: './usuario/lista' },
            { name: 'Roles', route: './usuario/roles' },
          ],
          subRoutesStatus: false,
        },
        {
          name: 'Áreas',
          icon: faBuilding,
          route: './areas'
        },
        {
          name: 'Seguimiento',
          icon: faMagnifyingGlass,
          route: './seguimiento'
        },
      ]
    },
  ];

  resetSubRoutesStatus() {
    this.sections.forEach(section => {
      section.routes.forEach(route => {
        if (route.subRoutesStatus !== undefined) {
          route.subRoutesStatus = false;
        }
      });
    });
  }

  ArrowDown = faAngleDown;
  LogOut = faArrowRightFromBracket;
}