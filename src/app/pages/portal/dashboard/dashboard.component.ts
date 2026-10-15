import { formatDate } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faArrowTrendUp, faBell, faClock, faEnvelope, faFileLines, faPaperPlane, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { Movimiento, Tramite } from '../../../interfaces/tramite';
import { AuthService } from '../../../services/auth.service';
import { DependenciasService } from '../../../services/dependencias.service';
import { DocumentosService } from '../../../services/documentos.service';
import { TramitesService } from '../../../services/tramites.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';

interface RecentMovement {
  tramite: Tramite;
  movimiento: Movimiento;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FaIconComponent, BreadcrumbComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Dashboard'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Dashboard</h1>
      </div>
      <!-- Resumen -->
      <div>
        <div class="flex justify-between">
          <p class="text-lg font-semibold text-neutral-800">Resumen de {{ dependenciaNombre() }}</p>
          <p class="text-xs font-medium text-neutral-500">Actividad de los últimos 30 días</p>
        </div>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
          <!-- 1 -->
          <div class="col-span-1 flex gap-2 cursor-pointer card" routerLink="portal/tramitesR">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-amber-500 shadow-md">
              <fa-icon [icon]="Bell"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500">Por revisar</p>
              <p class="text-2xl font-bold text-neutral-800">{{ tramitesNoVistos().length }}</p>
            </div>
          </div>
          <!-- 2 -->
          <div class="col-span-1 flex gap-2 cursor-pointer card" routerLink="/portal/tramitesR">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-green-500 shadow-md">
              <fa-icon [icon]="Inbox"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500">En la dependencia</p>
              <p class="text-2xl font-bold text-neutral-800">{{ tramitesEnDependencia().length }}</p>
            </div>
          </div>
          <!-- 3 -->
          <div class="col-span-1 flex gap-2 cursor-pointer card" routerLink="/portal/tramitesE">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-sky-500 shadow-md">
              <fa-icon [icon]="Send"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500">Fuera de la dependencia</p>
              <p class="text-2xl font-bold text-neutral-800">{{ tramitesFuera().length }}</p>
            </div>
          </div>
          <!-- 4 -->
          <div class="col-span-1 flex gap-2 cursor-pointer card" routerLink="/portal/tramitesR">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-red-500 shadow-md">
              <fa-icon [icon]="Returned"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-medium text-neutral-500">Devueltos</p>
              <p class="text-2xl font-bold text-neutral-800">{{ tramitesDevueltos().length }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Content -->
      <div class="grid grid-cols-4 gap-2">
        <!-- Buzon -->
        <div class="col-span-2 card w-full">
          <div class="flex items-center justify-between border-b pb-2 border-neutral-100">
            <div>
              <h2 class="font-semibold text-neutral-800">Buzón de notificaciones</h2>
              <p class="text-xs text-neutral-400">Trámites recibidos pendientes de revisión</p>
            </div>
            <span class="rounded-full bg-main px-4 py-1 text-xs font-semibold text-white">{{ tramitesNoVistos().length }}</span>
          </div>
          <div class="divide-y divide-neutral-100 pt-2">
            @for (tramite of tramitesNoVistos().slice(0, 5); track tramite.id ?? tramite.codigoTicket) {
              <div routerLink="/portal/tramitesR" class="group cursor-pointer flex rounded-xl items-center gap-2 p-2 transition hover:bg-main/10">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main"><fa-icon [icon]="Inbox"></fa-icon></span>
                <span class="min-w-0 flex-1">
                  <span class="flex flex-wrap items-center justify-between">
                    <span class="text-xs font-semibold text-neutral-800">{{ tramite.codigoTicket }}</span>
                    <span class="text-xxs text-neutral-400">{{ formatDate(tramite.trazabilidad[0]?.fechaEnvio) }}</span>
                  </span>
                  <span class="block truncate text-xs text-neutral-500">De: {{ getDependenciaName(tramite.trazabilidad[0]?.dependenciaEmisor) || 'No especificado' }}</span>
                </span>
                <fa-icon [icon]="Arrow" class="shrink-0 text-xs text-neutral-300 group-hover:text-main transition"></fa-icon>
              </div>
            } @empty {
              <p class="px-5 py-8 text-center text-sm text-neutral-500">No tienes trámites pendientes de revisión.</p>
            }
          </div>
        </div>
        <!-- Tiempo -->
        <div class="col-span-2 card w-full">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 class="font-semibold text-neutral-800">Mayor tiempo en la dependencia</h2>
              <p class="text-xs text-neutral-400">Antigüedad desde su recepción</p>
            </div>
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-main/10 text-main"><fa-icon [icon]="Clock"></fa-icon></span>
          </div>
          <div class="divide-y divide-neutral-100 pt-2">
            @for (tramite of tramitesMasAntiguos(); track tramite.id ?? tramite.codigoTicket) {
              <div class="flex rounded-xl items-center gap-2 p-2 transition hover:bg-main/10">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main"><fa-icon [icon]="Clock"></fa-icon></span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-semibold text-neutral-800">{{ tramite.codigoTicket }}</span>
                  <span class="block truncate text-xs text-neutral-500">{{ getDependenciaName(tramite.trazabilidad[0]?.dependenciaEmisor) || 'Origen no disponible' }}</span>
                </span>
                <span class="shrink-0 text-right text-xs font-medium text-neutral-500">{{ getTimeInDependency(tramite) }}</span>
              </div>
            } @empty {
              <p class="px-5 py-8 text-center text-sm text-neutral-500">No hay trámites en la dependencia.</p>
            }
          </div>
          <div class="border-t border-neutral-100 mt-2">
            <button type="button" routerLink="/portal/tramitesR" class="block cursor-pointer w-full py-3 mt-2 text-center rounded-xl text-xs font-semibold text-main transition hover:bg-main hover:text-white">
              Ir a recibidos <fa-icon [icon]="Arrow"></fa-icon>
            </button>
          </div>
        </div>
        <!-- Actividad Reciente -->
        <div class="col-span-2 card w-full">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 class="font-semibold text-neutral-800">Actividad reciente</h2>
              <p class="text-xs text-neutral-400">Últimos movimientos relacionados con la dependencia</p>
            </div>
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-main/10 text-main"><fa-icon [icon]="Activity"></fa-icon></span>
          </div>
          <div class="divide-y divide-neutral-100 pt-2">
            @for (event of actividadReciente(); track event.tramite.id + '-' + event.date.getTime() + '-' + event.movimiento.estado) {
              <a [routerLink]="getTramiteRoute(event.tramite)" class="group flex cursor-pointer items-center gap-2 rounded-xl p-2 transition hover:bg-main/10">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main">
                  <fa-icon [icon]="event.movimiento.dependenciaReceptor === dependenciaId() ? Inbox : Send" class="text-xs"></fa-icon>
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs text-neutral-700"><strong class="font-semibold text-neutral-800">{{ event.tramite.codigoTicket }}</strong> · {{ getMovementDescription(event.movimiento) }}</span>
                  <span class="block truncate text-xs text-neutral-400">{{ event.movimiento.estado }}@if (event.movimiento.observaciones) { · {{ event.movimiento.observaciones }} }</span>
                </span>
                <span class="shrink-0 text-right text-xxs text-neutral-400">{{ formatDate(event.date) }}</span>
                <fa-icon [icon]="Arrow" class="shrink-0 text-xs text-neutral-300 transition group-hover:text-main"></fa-icon>
              </a>
            } @empty {
              <p class="px-2 py-8 text-center text-sm text-neutral-500">Todavía no hay actividad para mostrar.</p>
            }
          </div>
        </div>
        <!-- Documents -->
        <div class="col-span-2 card w-full">
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div>
              <h2 class="font-semibold text-neutral-800">Documentos recientes</h2>
              <p class="text-xs text-neutral-400">{{ documentos().length }} documentos de la dependencia</p>
            </div>
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-main/10 text-main"><fa-icon [icon]="File"></fa-icon></span>
          </div>
          <div class="divide-y divide-neutral-100 pt-2">
            @for (documento of documentosRecientes(); track documento.id ?? documento.codigo) {
              <a routerLink="/portal/documentos" class="group flex cursor-pointer items-center gap-2 rounded-xl p-2 transition hover:bg-main/10">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-main/10 text-main"><fa-icon [icon]="File"></fa-icon></span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-xs font-semibold text-neutral-800">{{ documento.codigo }}</span>
                  <span class="block truncate text-xs text-neutral-500">{{ documento.asunto }}</span>
                </span>
                <span class="shrink-0 text-right text-xxs text-neutral-400">{{ formatDate(documento.fechaModificacion) }}</span>
                <fa-icon [icon]="Arrow" class="shrink-0 text-xs text-neutral-300 transition group-hover:text-main"></fa-icon>
              </a>
            } @empty {
              <p class="px-2 py-8 text-center text-sm text-neutral-500">Aún no hay documentos registrados.</p>
            }
          </div>
          <div class="mt-2 border-t border-neutral-100 pt-2">
            <a routerLink="/portal/documentos" class="block w-full rounded-xl py-3 text-center text-xs font-semibold text-main transition hover:bg-main hover:text-white">Ver documentos <fa-icon [icon]="Arrow"></fa-icon></a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class DashboardComponent {
  private tramitesService = inject(TramitesService);
  private dependenciasService = inject(DependenciasService);
  private documentosService = inject(DocumentosService);
  currentUser = inject(AuthService).usuarioLogged;
  tramitesNoVistos = this.tramitesService.tramitesRecibidosNoVistos;
  tramitesRelacionados = this.tramitesService.tramitesRelacionados;
  documentos = this.documentosService.documentos;
  dependencias = this.dependenciasService.dependencias;

  private readonly today = new Date();
  dependenciaId = computed(() => this.currentUser()?.dependenciaId ?? '');
  dependenciaNombre = computed(() => {
    const dependencia = this.dependencias().find(item => item.id === this.dependenciaId());
    return dependencia?.nombre ?? 'mi dependencia';
  });
  tramitesEnDependencia = computed(() => this.tramitesRelacionados().filter(tramite => tramite.dependenciaActual === this.dependenciaId()));
  tramitesFuera = computed(() => this.tramitesRelacionados().filter(tramite =>
    tramite.dependenciaActual !== this.dependenciaId() && tramite.trazabilidad?.some(movimiento => movimiento.dependenciaEmisor === this.dependenciaId()),
  ));
  tramitesDevueltos = computed(() => this.tramitesEnDependencia().filter(tramite => tramite.estadoActual === 'Devuelto'));
  tramitesMasAntiguos = computed(() => [...this.tramitesEnDependencia()]
    .sort((a, b) => this.getCurrentAgeDate(a).getTime() - this.getCurrentAgeDate(b).getTime())
    .slice(0, 5));
  documentosRecientes = computed(() => [...this.documentos()]
    .sort((a, b) => this.getDateValue(b.fechaModificacion) - this.getDateValue(a.fechaModificacion))
    .slice(0, 5));
  actividadReciente = computed(() => {
    const dependencyId = this.dependenciaId();
    return this.tramitesRelacionados().flatMap(tramite => (tramite.trazabilidad ?? [])
      .filter(movimiento => movimiento.dependenciaEmisor === dependencyId || movimiento.dependenciaReceptor === dependencyId)
      .map(movimiento => ({ tramite, movimiento, date: this.toDate(movimiento.fechaEnvio) } as RecentMovement))
      .filter(event => event.date !== null))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);
  });
  Bell = faBell;
  Inbox = faEnvelope;
  Send = faPaperPlane;
  Returned = faRotateLeft;
  Clock = faClock;
  File = faFileLines;
  Activity = faArrowTrendUp;
  Arrow = faArrowRight;

  getDependenciaName(id: string | undefined): string {
    if (!id) return '';
    return this.dependencias().find(dependencia => dependencia.id === id)?.nombre ?? '';
  }

  getMovementDescription(movimiento: Movimiento): string {
    const emisor = this.getDependenciaName(movimiento.dependenciaEmisor) || 'una dependencia';
    const receptor = this.getDependenciaName(movimiento.dependenciaReceptor) || 'una dependencia';
    if (movimiento.dependenciaReceptor === this.dependenciaId()) return `recibido de ${emisor}`;
    return `derivado a ${receptor}`;
  }

  getTramiteRoute(tramite: Tramite): string {
    return tramite.dependenciaActual === this.dependenciaId() ? '/portal/tramitesR' : '/portal/tramitesE';
  }

  getTimeInDependency(tramite: Tramite): string {
    const movement = tramite.trazabilidad?.[0];
    const since = this.toDate(movement?.fechaRecepcion) ?? this.toDate(movement?.fechaEnvio);
    if (!since) return 'Fecha no disponible';
    const elapsedHours = Math.max(0, Math.floor((this.today.getTime() - since.getTime()) / 3_600_000));
    const days = Math.floor(elapsedHours / 24);
    if (days > 0) return `hace ${days} d`;
    if (elapsedHours > 0) return `hace ${elapsedHours} h`;
    return 'hace <1 h';
  }

  formatDate(value: unknown): string {
    const date = this.toDate(value);
    if (!date) return 'Fecha no disponible';
    return formatDate(date, 'dd MMM, HH:mm', 'es').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  private getCurrentAgeDate(tramite: Tramite): Date {
    const movement = tramite.trazabilidad?.[0];
    return this.toDate(movement?.fechaRecepcion) ?? this.toDate(movement?.fechaEnvio) ?? new Date(0);
  }

  private getDateValue(value: unknown): number {
    return this.toDate(value)?.getTime() ?? 0;
  }

  private toDate(value: unknown): Date | null {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      const date = value.toDate();
      return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    return null;
  }
}
