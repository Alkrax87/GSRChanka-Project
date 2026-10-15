import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChartSimple, faEnvelopeOpenText, faFileLines, faFolder, faHammer, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { DependenciasService } from '../../../services/dependencias.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent],
  template: `
    <section class="relative isolate flex h-[calc(100dvh-56px)] flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-8 select-none">
      <div class="z-10 mx-auto w-full max-w-3xl text-center">
        <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-main border-[3px] border-cloud sm:h-16 sm:w-16">
          <fa-icon [icon]="WelcomeIcon" class="text-2xl sm:text-3xl"></fa-icon>
        </div>
        @if (currentUser(); as user) {
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-main/80">Portal de gestión documental</p>
          <h1 class="text-3xl font-semibold tracking-tight text-neutral-800 sm:text-5xl">
            ¡Bienvenido, <span class="text-main">{{ firstName(user.displayName) }}</span>!
          </h1>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 sm:text-base">
            @if (dependenciaNombre()) {
              Estás trabajando en <span class="font-semibold text-neutral-700">{{ dependenciaNombre() }}</span>.
            } @else {
              Desde aquí puedes continuar con la gestión de tus documentos y trámites.
            }
          </p>
        } @else {
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-main/80">Portal de gestión documental</p>
          <h1 class="text-3xl font-semibold tracking-tight text-neutral-800 sm:text-5xl">Bienvenido</h1>
          <p class="mt-3 text-sm text-neutral-500 sm:text-base">Preparando tu espacio de trabajo…</p>
        }
        <div class="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:mt-10 sm:gap-4">
          @for (shortcut of shortcuts(); track shortcut.route) {
            <a [routerLink]="shortcut.route" class="group flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-100 bg-white/90 px-2 py-4 text-neutral-600 shadow-sm transition hover:-translate-y-1 hover:border-main/20 hover:text-main hover:shadow-main/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main sm:min-h-28 sm:gap-3 sm:rounded-3xl sm:px-4">
              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-main/10 text-main transition group-hover:bg-main group-hover:text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                <fa-icon [icon]="shortcut.icon" class="text-base sm:text-lg"></fa-icon>
              </span>
              <span class="text-center text-xxs font-semibold sm:text-sm">{{ shortcut.label }}</span>
            </a>
          }
        </div>
      </div>
      <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <img loading="lazy" src="assets/svg/wave.svg" class="block h-auto w-full object-cover object-top min-h-32 max-h-[27vh]" alt="Waves-SVG" />
      </div>
      <p class="absolute bottom-3 z-10 text-[10px] font-semibold tracking-wide text-white/90 sm:bottom-4 sm:text-xs">GSRChanka &nbsp;·&nbsp; Gestión documental</p>
    </section>
  `,
  styles: ``,
})
export class HomeComponent {
  currentUser = inject(AuthService).usuarioLogged;
  private dependencias = inject(DependenciasService).dependencias;

  WelcomeIcon = faFolder;

  dependenciaNombre = computed(() => {
    const dependenciaId = this.currentUser()?.dependenciaId;
    return this.dependencias().find(dependencia => dependencia.id === dependenciaId)?.nombre ?? '';
  });

  shortcuts = computed(() => {
    const role = this.currentUser()?.role;
    if (role === 'SUPERADMIN') {
      return [
        { label: 'Usuarios', route: '/portal/usuarios', icon: faUsers },
        { label: 'Áreas', route: '/portal/areas', icon: faFolder },
        { label: 'Obras', route: '/portal/obras', icon: faHammer },
      ];
    }
    if (role === 'BOSS') {
      return [
        { label: 'Dashboard', route: '/portal/dashboard', icon: faChartSimple },
        { label: 'Recibidos', route: '/portal/tramitesR', icon: faEnvelopeOpenText },
        { label: 'Documentos', route: '/portal/documentos', icon: faFileLines },
      ];
    }
    return [
      { label: 'Recibidos', route: '/portal/tramitesR', icon: faEnvelopeOpenText },
      { label: 'Iniciados', route: '/portal/tramitesI', icon: faChartSimple },
      { label: 'Documentos', route: '/portal/documentos', icon: faFileLines },
    ];
  });

  firstName(displayName: string): string {
    return displayName.trim().split(/\s+/)[0] || displayName;
  }
}