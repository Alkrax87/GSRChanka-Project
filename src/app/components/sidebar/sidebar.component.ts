import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faArrowRightFromBracket, faBuilding, faChartSimple, faEnvelope, faEnvelopeOpenText, faFileLines, faFilePen, faHammer, faHome, faPaperPlane, faUserShield, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { LogOutComponent } from '../log-out/log-out.component';

interface SidebarRoute {
  name: string;
  icon: IconDefinition;
  route?: string;
  subroutes?: { name: string; icon: IconDefinition; route: string }[];
  expanded?: boolean;
}

interface SidebarSection {
  sectionName: string;
  allowedRoles?: string[];
  routes: SidebarRoute[];
}

@Component({
  selector: 'app-sidebar',
  imports: [FaIconComponent, RouterLink, RouterLinkActive, LogOutComponent],
  template: `
    @if (mobileOpen) {
      <button type="button" aria-label="Cerrar menú" class="fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-sm md:hidden" (click)="closeMobile.emit()"></button>
    }

    <aside
      class="fixed inset-y-0 left-0 z-50 flex flex-col overflow-visible border-r rounded-r-2xl border-neutral-200 bg-white text-neutral-700 shadow-xl shadow-neutral-200/60 transition-[width,transform] duration-300 ease-out md:translate-x-0"
      [class.w-56]="isOpen"
      [class.w-16]="!isOpen"
      [class.translate-x-0]="mobileOpen"
      [class.-translate-x-full]="!mobileOpen"
    >
      <a routerLink="/portal/home" (click)="closeMobile.emit()" class="m-2 flex h-12 items-center gap-2 overflow-hidden rounded-xl px-1.5 outline-none">
        <img src="https://pbs.twimg.com/profile_images/1223279373542993920/rtXA6v2o_200x200.jpg" alt="GSR Chanka" class="h-10 w-10 min-w-10 rounded-xl object-cover p-0.5">
        @if (isOpen) {
          <div class="whitespace-nowrap">
            <p class="text-xl font-bold"><span class="text-main">GSR</span>Chanka</p>
            <p class="text-xs tracking-wider text-neutral-500">Gestión documental</p>
          </div>
        }
      </a>
      <!-- Content -->
      <nav class="flex-1 space-y-4 overflow-y-auto px-2 py-4 md:overflow-visible">
        @for (section of sections; track section.sectionName) {
          @if (canViewSection(section)) {
            <section>
              <!-- Section Name -->
              @if (isOpen) {
                <p class="mb-1 px-3 text-xxs tracking-wider text-neutral-400">{{ section.sectionName }}</p>
              } @else {
                <div class="h-[15px] mb-1">
                  <div class="mx-auto h-px w-8 bg-neutral-200"></div>
                </div>
              }
              <!-- Routes -->
              <div class="space-y-1">
                @for (item of section.routes; track item.name) {
                  @if (item.route) {
                    <!-- Single -->
                    <a [routerLink]="item.route" (click)="closeMobile.emit()" routerLinkActive="!bg-main !text-white"
                      [class.px-4]="isOpen"
                      class="group/nav relative flex h-10 font-medium items-center gap-2 rounded-xl text-sm text-neutral-500 outline-none transition hover:bg-main hover:text-white"
                    >
                      <fa-icon [icon]="item.icon" class="w-5 min-w-5 text-center" [class.mx-auto]="!isOpen"></fa-icon>
                      @if (isOpen) {
                        <span class="truncate">{{ item.name }}</span>
                      } @else {
                        <span class="pointer-events-none absolute left-[calc(100%+0.5rem)] top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-lg group-hover/nav:block">{{ item.name }}</span>
                      }
                    </a>
                  } @else {
                    <!-- Multi -->
                    <div class="group/nav relative">
                      <button type="button" class="relative flex h-10 w-full font-medium items-center gap-2 rounded-lg text-sm outline-none transition hover:bg-neutral-100"
                        [class.px-4]="isOpen"
                        [class.text-main]="isGroupActive(item)"
                        [class.text-neutral-500]="!isGroupActive(item)"
                        (click)="item.expanded = !item.expanded"
                        [attr.aria-expanded]="item.expanded"
                      >
                        <fa-icon [icon]="item.icon" class="w-5 min-w-5 text-center" [class.mx-auto]="!isOpen"></fa-icon>
                        @if (isOpen) {
                          <span class="flex-1 truncate text-left">{{ item.name }}</span>
                          <fa-icon [icon]="ArrowDown" class="text-xs transition-transform" [class.rotate-180]="item.expanded"></fa-icon>
                        }
                      </button>
                      @if (isOpen && item.expanded) {
                        <div class="ml-5 mt-1 space-y-1 border-l border-neutral-300 relative pl-2">
                          @for (subroute of item.subroutes; track subroute.route) {
                            <a [routerLink]="subroute.route" (click)="closeMobile.emit()" routerLinkActive="!bg-main !text-white"
                              class="h-8 items-center relative block rounded-xl px-4 py-2 text-xs text-neutral-500 outline-none transition before:absolute before:-left-2 before:top-1/2 before:w-2 before:border-t before:border-neutral-300 hover:bg-main hover:text-white"
                            >
                              <fa-icon [icon]="subroute.icon" class="w-5 min-w-5 text-center mr-2" [class.mx-auto]="!isOpen"></fa-icon>{{ subroute.name }}
                            </a>
                          }
                        </div>
                      }
                      @if (!isOpen) {
                        <div class="invisible absolute left-full top-0 z-50 w-48 translate-x-1 pl-2 opacity-0 transition group-hover/nav:visible group-hover/nav:translate-x-0 group-hover/nav:opacity-100">
                          <div class="rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                            <p class="px-2 pb-2 pt-1 text-xxs tracking-wider text-neutral-400">{{ item.name }}</p>
                            <div class="space-y-1">
                              @for (subroute of item.subroutes; track subroute.route) {
                                <a
                                  [routerLink]="subroute.route"
                                  (click)="closeMobile.emit()"
                                  routerLinkActive="!bg-main !text-white"
                                  class="block rounded-lg px-2 py-2 text-xs font-medium text-neutral-600 transition hover:bg-main hover:text-white"
                                >
                                  <fa-icon [icon]="subroute.icon" class="w-5 min-w-5 text-center mr-2" [class.mx-auto]="!isOpen"></fa-icon>{{ subroute.name }}
                                </a>
                              }
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  }
                }
              </div>
            </section>
          }
        }
      </nav>
      <!-- LogOut -->
      <button type="button" (click)="isLogOutModalOpen = true" class="hover:bg-red-500 hover:text-white px-4 my-4 flex h-10 font-medium items-center gap-2 rounded-xl text-xs text-neutral-500 outline-none transition mx-auto"
        [class.px-2]="isOpen!"
      >
        <fa-icon [icon]="LogOut"></fa-icon>
        @if (isOpen) {
          <span class="truncate">Cerrar Sesión</span>
        }
      </button>
    </aside>

    @if (isLogOutModalOpen) {
      <app-log-out (cancel)="isLogOutModalOpen = false"></app-log-out>
    }
  `,
  styles: ``,
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() mobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  private router = inject(Router);
  currentUser = inject(AuthService).usuarioLogged;
  isLogOutModalOpen = false;

  ArrowDown = faAngleDown;
  LogOut = faArrowRightFromBracket;

  sections: SidebarSection[] = [
    {
      sectionName: 'General',
      routes: [{ name: 'Inicio', icon: faHome, route: '/portal/home' }],
    },
    {
      sectionName: 'Administración',
      allowedRoles: ['SUPERADMIN'],
      routes: [
        { name: 'Usuarios', icon: faUserShield, route: '/portal/usuarios' },
        {
          name: 'Dependencias',
          icon: faBuilding,
          expanded: true,
          subroutes: [
            { name: 'Áreas', icon: faBuilding, route: '/portal/areas' },
            { name: 'Obras', icon: faHammer, route: '/portal/obras' },
          ],
        },
      ],
    },
    {
      sectionName: 'Análisis',
      allowedRoles: ['BOSS'],
      routes: [{ name: 'Dashboard', icon: faChartSimple, route: '/portal/dashboard' }],
    },
    {
      sectionName: 'Gestión',
      allowedRoles: ['BOSS', 'OPERATOR'],
      routes: [
        { name: 'Documentos', icon: faFileLines, route: '/portal/documentos' },
        {
          name: 'Trámites',
          icon: faEnvelopeOpenText,
          expanded: true,
          subroutes: [
            { name: 'Recibidos', icon: faEnvelope, route: '/portal/tramitesR' },
            { name: 'Enviados', icon: faPaperPlane,  route: '/portal/tramitesE' },
            { name: 'Iniciados', icon: faFilePen, route: '/portal/tramitesI' },
          ],
        },
      ],
    },
  ];

  canViewSection(section: SidebarSection): boolean {
    return !section.allowedRoles || section.allowedRoles.includes(this.currentUser()?.role || '');
  }

  isGroupActive(item: SidebarRoute): boolean {
    return item.subroutes?.some(subroute => this.router.url.startsWith(subroute.route)) ?? false;
  }
}