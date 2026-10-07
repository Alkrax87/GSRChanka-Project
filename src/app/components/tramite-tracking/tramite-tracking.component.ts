import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tramite } from '../../interfaces/tramite';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCalendar, faCircleCheck, faCircleInfo, faCommentDots, faEnvelopeOpenText, faPaperPlane, faRotateLeft, faShareFromSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DocumentosService } from '../../services/documentos.service';
import { formatDate, NgClass } from '@angular/common';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-tramite-tracking',
  imports: [FaIconComponent, NgClass],
  template: `
    <div class="modal">
      <div class="card-modal w-full max-w-screen-md">
        <div class="flex justify-between">
          <h2 class="card-title">Seguimiento Trámite</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        @if (tramite) {
          <p class="text-main font-semibold text-sm">Ticket: {{ tramite.codigoTicket }}</p>
          <!-- Top -->
          <div
            class="border grid grid-cols-3 gap-4 p-4 rounded-xl"
            [ngClass]="{'border-emerald-200 bg-emerald-50': tramite.estadoActual === 'Finalizado'}"
          >
            <!-- 1 -->
            <div class="flex gap-2">
              <div class="bg-main/10 p-2 h-10 w-10 flex items-center justify-center text-main rounded-full">
                @if (tramite.estadoActual === 'Finalizado') { <fa-icon [icon]="Closed"></fa-icon> } @else { <fa-icon [icon]="Info"></fa-icon> }
              </div>
              <div class="my-auto">
                <p class="text-xs text-neutral-400">Estado</p>
                <p class="font-semibold text-sm -mt-1">{{ tramite.estadoActual }}</p>
              </div>
            </div>
            <!-- 2 -->
            <div class="flex gap-2">
              <div class="bg-main/10 p-2 h-10 w-10 flex items-center justify-center text-main rounded-full">
                <fa-icon [icon]="Calendar"></fa-icon>
              </div>
              <div class="my-auto">
                <p class="text-xs text-neutral-400">Fecha Inicio</p>
                <p class="font-semibold text-sm -mt-1">{{ getDateTransformed(tramite.trazabilidad[tramite.trazabilidad.length -1].fechaEnvio) }}</p>
              </div>
            </div>
            <!-- 3 -->
            <div class="flex gap-2">
              <div class="bg-main/10 p-2 h-10 w-10 flex items-center justify-center text-main rounded-full">
                <fa-icon [icon]="Send"></fa-icon>
              </div>
              <div class="my-auto">
                @if (tramite.estadoActual === 'Finalizado') {
                  <p class="text-xs text-neutral-400">Finalizado</p>
                  <p class="font-semibold text-sm -mt-1">{{ getDateTransformed(tramite.fechaCierre) }}</p>
                } @else {
                  <p class="text-xs text-neutral-400">Última vez derivado</p>
                  <p class="font-semibold text-sm -mt-1">{{ getDateTransformed(tramite.trazabilidad[0].fechaEnvio) }}</p>
                }
              </div>
            </div>
          </div>
          <!-- Timeline -->
          <div class="w-full overflow-y-auto min-w-fit max-h-[620px] hide-srollbar">
            <div class="space-y-4">
              @for (mov of tramite.trazabilidad; track $index) {
                <div class="flex gap-6">
                  <!-- Status Bar -->
                  <div class="relative">
                    <div class="absolute w-9 h-9 rounded-full flex items-center justify-center text-white ring-4 ring-white z-10" [ngClass]="getConfig(mov).bg">
                      <fa-icon class="text-xs" [icon]="getConfig(mov).icon"></fa-icon>
                    </div>
                    <div class="w-0.5 h-full ml-4 rounded-full" [ngClass]="getConfig(mov).bg"></div>
                  </div>
                  <!-- Card -->
                  <div class="w-full h-fit border p-4 rounded-xl" [ngClass]="getConfig(mov).border">
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                      <!-- Status -->
                      <span class="px-4 py-1 text-xs font-bold rounded-full uppercase" [ngClass]="[getConfig(mov).bgLight, getConfig(mov).text]">{{ mov.estado }}</span>
                      <!-- Date -->
                      <span class="text-xs font-semibold text-neutral-400"><fa-icon [icon]="Sent" class="mr-1"></fa-icon> {{ getDateTransformed(mov.fechaEnvio) }}</span>
                    </div>
                    <!-- Content -->
                    <div class="flex items-start flex-col gap-4 my-4">
                      <!-- Emisor -->
                      <div class="flex gap-2">
                        <div class="w-2 h-2 rounded-full bg-neutral-300 mt-0.5 mx-auto"></div>
                        <div>
                          <p class="text-[10px] text-neutral-400 font-semibold">EMITIDO POR</p>
                          <p class="text-sm font-bold text-neutral-700">{{ getDependenciaName(mov.dependenciaEmisor) }}</p>
                          <p class="text-xs text-neutral-500">{{ mov.usuarioEmisor }}</p>
                        </div>
                      </div>
                      <!-- Receptor -->
                      <div class="flex gap-2">
                        <div class="w-2 h-2 rounded-full mt-0.5 mx-auto" [ngClass]="getConfig(mov).bg"></div>
                        <div>
                          <p class="text-[10px] text-neutral-400 font-semibold">DERIVADO A</p>
                          <p class="text-sm font-bold text-neutral-700">{{ getDependenciaName(mov.dependenciaReceptor) }}</p>
                        </div>
                      </div>
                    </div>
                    <!-- Footer -->
                    <div class="bg-gray-50 rounded-lg p-4 text-xs border">
                      <!-- Times -->
                      <div class="flex items-center  justify-between">
                        <!-- Left -->
                        <div>
                          <span class="font-semibold block text-gray-400 text-[10px]">Recepción</span>
                          <span class="font-semibold" [class.text-neutral-800]="mov.fechaRecepcion" [class.text-neutral-400]="!mov.fechaRecepcion">{{ getDateTransformed(mov.fechaRecepcion) }}</span>
                        </div>
                        <!-- Right -->
                        <div class="text-right">
                          @if (tramite.estadoActual === 'Finalizado') {
                            <span class="font-semibold block text-gray-400 text-[10px]">Finalizado</span>
                            <span class="font-semibold text-neutral-800">{{ getDateTransformed(tramite.fechaCierre) }}</span>
                          } @else {
                            <span class="font-semibold block text-gray-400 text-[10px]">Salida</span>
                            <span class="font-semibold" [class.text-neutral-800]="mov.fechaSalida" [class.text-neutral-400]="!mov.fechaSalida">{{ getDateTransformed(mov.fechaSalida) }}</span>
                          }
                        </div>
                      </div>
                      <!-- Observaciones -->
                      @if (mov.observaciones) {
                        <div class="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                          <fa-icon [icon]="Comment" class="text-gray-400 mt-0.5 text-sm"></fa-icon>
                          <p class="italic text-gray-600">"{{ mov.observaciones }}"</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .hide-srollbar::-webkit-scrollbar {
      display: none;
    }

    .hide-srollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
  `,
})
export class TramiteTrackingComponent {
  @Input() tramite!: Tramite;
  @Output() close = new EventEmitter<void>();

  dependencias = inject(DependenciasService).dependencias;
  documentos = inject(DocumentosService).documentos;

  getDateTransformed(date: any): string {
    if (!date) return 'Pendiente...';

    let jsDate: Date;

    if (typeof date.toDate === 'function') {
      jsDate = date.toDate();
    }
    else if (date.seconds) {
      jsDate = new Date(date.seconds * 1000);
    }
    else if (date instanceof Date) {
      jsDate = date;
    }
    else {
      return 'Fecha inválida';
    }

    const formatted = formatDate(jsDate, 'EEE dd MMM, HH:mm', 'es');
    return formatted.replace(/\b\w/g, l => l.toUpperCase());
  }

  getDependenciaName(dependenciaId: string) {
    const dependencia = this.dependencias().find(d => d.id === dependenciaId);
    return dependencia ? dependencia.nombre : '';
  }

  // Icons
  X = faTimes;
  Info = faCircleInfo;
  Calendar = faCalendar;
  Send = faPaperPlane;
  Sent = faPaperPlane;
  Derived = faShareFromSquare;
  Returned = faRotateLeft;
  Opened = faEnvelopeOpenText;
  Comment = faCommentDots;
  Closed = faCircleCheck;

  getConfig(movimiento: any) {
    // Devuelto
    if (movimiento.estado === 'Devuelto') {
      return { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-200', bgLight: 'bg-red-50', icon: this.Returned };
    }
    // Derivado
    if (movimiento.estado === 'Derivado') {
      return { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', bgLight: 'bg-green-50', icon: this.Derived };
    }
    // Leído
    if (movimiento.estado === 'Enviado' && movimiento.fechaRecepcion) {
      return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-200', bgLight: 'bg-blue-50', icon: this.Opened };
    }
    // No Leído
    return { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', bgLight: 'bg-amber-50', icon: this.Sent };
  }
}