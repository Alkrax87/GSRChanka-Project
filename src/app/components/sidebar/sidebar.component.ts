import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleRight, faArrowRightFromBracket, faBuilding, faHome, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { LogOutComponent } from "../log-out/log-out.component";

@Component({
  selector: 'app-sidebar',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, CommonModule, LogOutComponent],
  template: `
    <div
      class="flex flex-col bg-neutral-800 duration-300 h-[100vh] fixed left-0 top-0 text-white z-50"
      [ngClass]="{ 'w-64': isOpen, 'w-12': !isOpen }"
    >
      <!-- Title -->
      <div class="p-1">
        <div
          [routerLink]="'./home'"
          class="flex items-center gap-2 rounded-lg cursor-pointer duration-300 outline-none"
          [ngClass]="{ 'p-2 hover:bg-neutral-700 h-14': isOpen, 'h-8 my-3 pl-1': !isOpen }"
        >
          <img
            loading="lazy"
            src="https://placehold.co/40x40" alt="BRAND-logo"
            class="rounded-md duration-300"
            [ngClass]="{ 'w-9 h-9': isOpen, 'w-8 h-8': !isOpen }"
          >
          @if (isOpen) {
            <p class="text-xl"><span class="font-bold">GSR</span>Chanka</p>
          }
        </div>
      </div>
      <!-- Button -->
      <div class="relative">
        <div (click)="changeSidebarStatus()" class="bg-main hover:bg-main-hover cursor-pointer flex justify-center items-center w-8 h-8 absolute rounded-full -top-4 -right-4">
          <fa-icon class="duration-300" [icon]="ArrowClose" [ngClass]="{ 'rotate-180' : isOpen}"></fa-icon>
        </div>
      </div>
      <!-- Content -->
      <div class="bg-neutral-700 h-0.5"></div>
      <div class="flex flex-col gap-2 h-full py-3 px-2">
        @for (section of sections; track $index) {
          <div>
            @if (isOpen) {
              <p class="text-neutral-500 text-xs px-2 mb-1">{{ section.sectionName }}</p>
            } @else {
              <div class="place-content-center h-4 mb-1">
                <div class="bg-neutral-600 rounded-full h-0.5"></div>
              </div>
            }
            <div class="flex flex-col gap-1">
              @for (route of section.routes; track $index) {
                @if (!route.multiRoutes) {
                  <div
                    class="flex gap-2 cursor-pointer pl-4 pr-2 py-2 -ml-2 hover:bg-main rounded-r-full text-sm duration-300 outline-none"
                    [routerLink]="route.route"
                    [routerLinkActive]="['bg-main']"
                    (click)="resetSubRoutesStatus()"
                  >
                    <div class="min-w-4 max-w-4">
                      <fa-icon [icon]="route.icon"></fa-icon>
                    </div>
                    @if (isOpen) {
                      <p class="w-full">{{ route.name }}</p>
                    }
                  </div>
                } @else {
                  <div
                    class="flex gap-2 cursor-pointer pl-4 pr-2 py-2 -ml-2 hover:bg-main rounded-r-full text-sm duration-300 outline-none"
                    [routerLink]="route.route"
                    [routerLinkActive]="['bg-main']"
                    (click)="route.subRoutesStatus = !route.subRoutesStatus"
                  >
                    <div class="min-w-4 max-w-4">
                      <fa-icon [icon]="route.icon"></fa-icon>
                    </div>
                    @if (isOpen) {
                      <p class="w-full">{{ route.name }}</p>
                      @if (route.subroutes) {
                        <fa-icon class="text-center w-8 duration-300" [icon]="ArrowDown" [ngClass]="{ 'rotate-180' : route.subRoutesStatus}"></fa-icon>
                      }
                    }
                  </div>
                  @if (isOpen) {
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
              }
            </div>
          </div>
        }
      </div>
      <div class="bg-neutral-700 h-0.5"></div>
      <!-- User -->
      <div class="p-2">
         <div class="flex items-center py-2 h-12 gap-2 duration-300" [ngClass]="{ 'px-2': isOpen }">
            <img
              loading="lazy"
              src="https://placehold.co/32x32"
              alt="USER-logo"
              class="rounded-full w-8 h-8"
              [ngClass]="{ 'cursor-pointer': !isOpen }"
              (click)="!isOpen && (isLogOutModalOpen = true)"
            >
            @if (isOpen) {
              <div class="flex flex-col w-full truncate">
                <p class="font-semibold text-sm -mb-1 truncate">{{ user.name + ' ' + user.lastname }}</p>
                <p class="text-xs">{{ user.username }}</p>
              </div>
              <div class="flex items-center justify-center">
                <button (click)="isLogOutModalOpen = true" [ngClass]="{'bg-white text-neutral-800': isLogOutModalOpen}" class="hover:bg-white hover hover:text-neutral-800 duration-300 rounded-lg w-8 h-8">
                  <fa-icon [icon]="LogOut"></fa-icon>
                </button>
              </div>
            }
        </div>
       </div>
    </div>

    @if (isLogOutModalOpen) {
      <app-log-out (cancel)="isLogOutModalOpen = false"></app-log-out>
    }
  `,
  styles: ``,
})
export class SidebarComponent {
  @Output() sidebarStatus = new EventEmitter<boolean>();
  isLogOutModalOpen = false;

  isOpen: boolean = true;

  ArrowDown = faAngleDown;
  ArrowClose = faAngleRight;
  LogOut = faArrowRightFromBracket;

  user: { name: string, lastname: string, username: string } = {
    name: 'Paco',
    lastname: 'Bazán',
    username: 'pbazan',
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
            { name: 'Usuarios', route: './usuario/usuarios' },
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

  changeSidebarStatus() {
    this.isOpen = !this.isOpen;
    this.sidebarStatus.emit(this.isOpen);
  }
}