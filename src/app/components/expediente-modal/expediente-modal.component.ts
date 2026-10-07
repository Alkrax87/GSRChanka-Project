import { Component, DestroyRef, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { formatDate, TitleCasePipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDownload, faFileLines, faTimes } from '@fortawesome/free-solid-svg-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Expediente } from '../../interfaces/expediente';
import { Documento } from '../../interfaces/documento';
import { DocumentosService } from '../../services/documentos.service';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-expediente-modal',
  imports: [FaIconComponent, TitleCasePipe],
  template: `
    <div class="modal">
      <div class="card-modal w-full max-w-screen-md">
        <div class="flex justify-between">
          <h2 class="card-title">Expediente</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <p class="text-sm text-main font-semibold">Ticket: {{ expediente?.codigoTicket }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border rounded-xl p-4">
          <div><p class="text-xs text-neutral-400">Dependencia que finalizó</p><p class="font-semibold">{{ dependenciaName(expediente?.dependenciaFinal) }}</p></div>
          <div><p class="text-xs text-neutral-400">Fecha de cierre</p><p class="font-semibold">{{ formatDateValue(expediente?.fechaCierre) | titlecase }}</p></div>
          <div><p class="text-xs text-neutral-400">Cerrado por</p><p class="font-semibold">{{ expediente?.usuarioCierre }}</p></div>
        </div>
        <div>
          <h3 class="text-sm font-semibold text-main mb-2">Dependencias por las que pasó</h3>
          <p class="text-sm text-neutral-600">{{ dependenciasRecorridas() }}</p>
        </div>
        <div class="overflow-y-auto flex-1">
          <h3 class="text-sm font-semibold text-main mb-2">Documentos ({{ documentos().length }})</h3>
          <div class="space-y-2">
            @for (doc of documentos(); track doc.id) {
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 overflow-hidden">
                  <div class="w-10 h-10 rounded-lg bg-main/10 flex justify-center items-center text-main"><fa-icon [icon]="Document"></fa-icon></div>
                  <div><p class="text-xs font-semibold text-neutral-400 truncate">{{ doc.codigo }}</p><p class="text-sm font-semibold text-neutral-700 truncate">{{ doc.asunto }}</p></div>
                </div>
                <a target="_blank" [href]="doc.archivo.url" class="text-sky-600 hover:text-sky-600/75 px-2" [attr.aria-label]="'Descargar ' + doc.asunto"><fa-icon [icon]="Download"></fa-icon></a>
              </div>
            } @empty {
              <p class="text-sm text-gray-400 italic text-center py-4">No hay documentos cargados.</p>
            }
          </div>
        </div>
        <div class="flex justify-end"><button type="button" (click)="close.emit()" class="btn-cancel">Cerrar</button></div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ExpedienteModalComponent {
  @Input() expediente: Expediente | null = null;
  @Output() close = new EventEmitter<void>();
  private documentosService = inject(DocumentosService);
  private dependencias = inject(DependenciasService).dependencias;
  private destroyRef = inject(DestroyRef);
  documentos = signal<Documento[]>([]);

  X = faTimes;
  Document = faFileLines;
  Download = faDownload;

  ngOnInit() {
    if (!this.expediente) return;
    this.documentosService.getDocumentosPorIds(this.expediente.documentosAdjuntos || []).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => this.documentos.set(data),
      error: (error) => console.error('Error cargando documentos del expediente', error)
    });
  }

  dependenciaName(id?: string): string {
    return this.dependencias().find(dependencia => dependencia.id === id)?.nombre || '-';
  }

  dependenciasRecorridas(): string {
    const ids = this.expediente?.dependenciasInvolucradas || [];
    return ids.map(id => this.dependenciaName(id)).join(' → ') || '-';
  }

  formatDateValue(value: any): string {
    if (!value) return '-';
    const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : formatDate(date, 'EEE dd MMM yyyy, HH:mm', 'es');
  }
}
