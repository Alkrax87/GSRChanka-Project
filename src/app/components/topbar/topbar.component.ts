import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars, faBell, faChevronLeft, faGear, faUser, faUserShield, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { TramitesService } from '../../services/tramites.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-topbar',
  imports: [FaIconComponent],
  template: `
    <header class="sticky top-0 z-30 flex h-14 w-full flex-shrink-0 items-center border-b border-neutral-200/80 bg-white px-2 sm:px-3">
      <div class="flex w-full items-center justify-between gap-2">
        <!-- Left -->
        <div class="flex min-w-0 items-center gap-2">
          <button type="button" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 shadow-sm outline-none transition hover:bg-neutral-100"
            (click)="toggleSidebar.emit()"
            aria-label="Alternar menú lateral"
          >
            <fa-icon [icon]="Menu" class="md:hidden"></fa-icon>
            <fa-icon [icon]="Collapse" class="hidden transition-transform duration-300 md:inline-block" [class.rotate-180]="!sidebarOpen"></fa-icon>
          </button>
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-neutral-800">Panel de gestión</p>
            <p class="hidden truncate text-xs font-medium tracking-wider text-neutral-400 sm:block">Gobierno Sub Regional de Chanka</p>
          </div>
        </div>
        <!-- Right -->
        <div class="flex shrink-0 items-center gap-1 sm:gap-2">
          <!-- Options -->
          <div class="flex items-center gap-1">
            <div class="relative">
              <button type="button" class="relative mr-1 flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 outline-none transition hover:bg-neutral-100 hover:text-neutral-800" aria-label="Notificaciones" [attr.aria-expanded]="notificationsOpen()" (click)="toggleNotifications()">
                @if (notificationsCount()) {
                  <span class="absolute -right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-main px-1 text-xxs font-bold leading-none text-white shadow-sm">
                    {{ notificationsCount() < 100 ? notificationsCount() : '99+' }}
                  </span>
                }
                <fa-icon [icon]="Notifications"></fa-icon>
              </button>
              <!-- Notifications Card -->
              @if (notificationsOpen()) {
                <section class="absolute right-0 top-10 z-50 w-[min(22rem,calc(100vw-1rem))] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl" aria-label="Notificaciones nuevas">
                  <div class="flex items-center justify-between border-b bg-main border-neutral-100 px-4 py-3">
                    <h2 class="font-semibold text-white">Notificaciones</h2>
                    <span class="text-xs font-medium text-neutral-100">{{ notificationsCount() }} &nbsp; nuevas</span>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    @for (tramite of tramitesNoVistos(); track tramite.id ?? tramite.codigoTicket) {
                      <button type="button" class="flex w-full flex-col gap-1 border-b border-neutral-100 px-4 py-3 text-left transition last:border-0 hover:bg-neutral-50" (click)="openTramiteNotifications()">
                        <span class="flex w-full items-center justify-between gap-2">
                          <span class="truncate text-xs font-semibold text-neutral-800">{{ tramite.codigoTicket }}</span>
                          <span class="shrink-0 text-xxs text-neutral-400">{{ formatDate(tramite.trazabilidad[0]?.fechaEnvio) }}</span>
                        </span>
                        <span class="truncate text-xs text-neutral-500">De: {{ getDependenciaName(tramite.trazabilidad[0].dependenciaEmisor) || 'No especificado' }}</span>
                      </button>
                    } @empty {
                      <p class="px-4 py-4 text-center text-sm text-neutral-500">No tienes notificaciones nuevas.</p>
                    }
                  </div>
                </section>
              }
            </div>
            <button type="button" class="hidden h-10 w-10 items-center justify-center rounded-lg text-neutral-500 outline-none transition hover:bg-neutral-100 hover:text-neutral-800 sm:flex" aria-label="Configuración">
              <fa-icon [icon]="Configuration"></fa-icon>
            </button>
          </div>
          <!-- User -->
          <div class="flex shrink-0 items-center gap-2 rounded-full">
            <p class="hidden max-w-32 truncate text-xs font-semibold text-neutral-600 sm:block lg:max-w-48">
              {{ '@' + (currentUser()?.username || 'usuario') }}
            </p>
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-main text-white" [attr.aria-label]="'Perfil de ' + (currentUser()?.username || 'usuario')">
              @switch (currentUser()?.role) {
                @case ('SUPERADMIN') { <fa-icon [icon]="Super"></fa-icon> }
                @case ('BOSS') { <fa-icon [icon]="Boss"></fa-icon> }
                @default { <fa-icon [icon]="Operator"></fa-icon> }
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class TopbarComponent {
  @Input() sidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  private tramitesService = inject(TramitesService);
  private router = inject(Router);
  dependencias = inject(DependenciasService).dependencias;
  currentUser = inject(AuthService).usuarioLogged;
  tramitesNoVistos = this.tramitesService.tramitesRecibidosNoVistos;
  notificationsCount = computed(() => this.tramitesNoVistos().length);
  notificationsOpen = signal(false);

  toggleNotifications() {
    this.notificationsOpen.update(isOpen => !isOpen);
  }

  openTramiteNotifications() {
    this.notificationsOpen.set(false);
    this.router.navigate(['/portal/tramitesR']);
  }

  formatDate(date: any) {
    const now = formatDate(date.toDate(), 'EEE dd MMM, HH:mm', 'es');
    return now.replace(/\b\w/g, l => l.toUpperCase());;
  }

  getDependenciaName(dependenciaId: string) {
    const dependencia = this.dependencias().find(d => d.id === dependenciaId);
    return dependencia ? dependencia.nombre : '';
  }

  Super = faUserShield;
  Boss = faUserTie;
  Operator = faUser;
  Menu = faBars;
  Collapse = faChevronLeft;
  Notifications = faBell;
  Configuration = faGear;
}