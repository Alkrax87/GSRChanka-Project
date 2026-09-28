import { Component, computed, DestroyRef, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Tramite } from '../../interfaces/tramite';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDownload, faFileCirclePlus, faFileLines, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DocumentosService } from '../../services/documentos.service';
import { TramitesService } from '../../services/tramites.service';
import { Documento } from '../../interfaces/documento';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tramite-adjuntar',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-full max-w-screen-md">
        <div class="flex justify-between">
          <h2 class="card-title">Seguimiento Trámite</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <h3 class="text-sm font-semibold text-main">Documentos Adjuntos ( {{ documentosAdjuntos().length }} )</h3>
        <div class="overflow-y-auto flex-1">
          <div class="space-y-2">
            @for (doc of documentosAdjuntos(); track doc.id) {
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 overflow-hidden">
                  <div class="w-10 h-10 rounded-lg bg-main/10 flex justify-center items-center text-main">
                    <fa-icon [icon]="Document"></fa-icon>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-neutral-400 truncate">{{ doc.codigo }}</p>
                    <p class="text-sm font-semibold text-neutral-700 truncate">{{ doc.asunto }}</p>
                  </div>
                </div>
                <a target="_blank" [href]="doc.archivo.url" class="text-sky-600 hover:text-sky-600/75 px-2">
                  <fa-icon [icon]="Download"></fa-icon>
                </a>
              </div>
            } @empty {
              <p class="text-sm text-gray-400 italic text-center py-4">No hay documentos cargados.</p>
            }
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <div class="p-4 rounded-xl border border-gray-200">
            <h3 class="text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
              <fa-icon [icon]="FileAdd" class="text-main"></fa-icon> Adjuntar Documento
            </h3>
            <select formControlName="documentoId" class="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-main/50 focus:ring-2 focus:ring-main/20 text-neutral-600 transition-all cursor-pointer">
              <option value="" disabled selected>-- Selecciona un documento --</option>
              @for (miDoc of documentosFiltrados(); track miDoc.id) {
                <option [value]="miDoc.id">{{ miDoc.codigo }}</option>
              } @empty {
                <option value="" disabled>No tienes documentos disponibles para adjuntar.</option>
              }
            </select>
          </div>
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || isSaving" class="btn-add text-center disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isSaving) { <span class="spin"></span>Agregando... } @else { <fa-icon [icon]="FileAdd"></fa-icon>Agregar }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteAdjuntarComponent {
  @Input() tramite!: Tramite;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private documentosService = inject(DocumentosService);
  private tramitesService = inject(TramitesService);
  private destroyRef = inject(DestroyRef);
  documentos = this.documentosService.documentos;
  documentosAdjuntos = signal<Documento[]>([]);
  isSaving = false;

  documentosFiltrados = computed(() => {
    return this.documentos().filter(doc => !this.tramite?.documentosAdjuntos.includes(doc.id!));
  });

  form = this.fb.group({
    documentoId: ['', Validators.required]
  });

  // Icons
  X = faTimes;
  Document = faFileLines;
  FileAdd = faFileCirclePlus;
  Download = faDownload;
  Save = faSave;

  ngOnInit() {
    this.cargarDocumentosAdjuntos();
  }

  cargarDocumentosAdjuntos() {
    this.documentosService.getDocumentosPorIds(this.tramite.documentosAdjuntos).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => (this.documentosAdjuntos.set(data)),
      error: (err) => (console.error("Error cargando adjuntos", err)),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const docSeleccionado = this.form.value.documentoId!;

      const nuevosAdjuntos = [...this.tramite.documentosAdjuntos, docSeleccionado];

      this.tramitesService.updateTramite(this.tramite.id!, { documentosAdjuntos: nuevosAdjuntos }).then(() => {
        alert('Documento adjuntado exitosamente al trámite.');
        // Actualizamos el estado local para que la UI reaccione inmediatamente
        // this.tramite.documentosAdjuntos = nuevosAdjuntos;
        // this.form.reset();
        // this.cargarDocumentosAdjuntos(); // Recargamos la lista visual
        this.isSaving = false;
        this.close.emit();
      }).catch((error) => {
        alert(error);
        this.isSaving = false;
      });
    }
  }
}