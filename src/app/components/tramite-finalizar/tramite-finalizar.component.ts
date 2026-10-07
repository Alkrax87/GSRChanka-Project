import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Tramite } from '../../interfaces/tramite';
import { ExpedientesService } from '../../services/expedientes.service';
import { TramitesService } from '../../services/tramites.service';

@Component({
  selector: 'app-tramite-finalizar',
  imports: [FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">Finalizar Trámite</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <p class="text-sm text-neutral-600">¿Deseas finalizar el trámite <span class="font-semibold">{{ tramite?.codigoTicket }}</span>?</p>
        <p class="text-xs text-neutral-500">El trámite se guardará como expediente y dejará de aparecer en Recibidos. Esta acción no se puede revertir.</p>
        <div class="flex justify-end gap-2">
          <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
          <button type="button" (click)="onSubmit()" [disabled]="isSaving" class="btn-add disabled:opacity-50 disabled:cursor-not-allowed">
            @if (isSaving) { <span class="spin"></span>Finalizando... } @else { <fa-icon [icon]="Check"></fa-icon>Finalizar }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteFinalizarComponent {
  @Input() tramite: Tramite | null = null;
  @Output() close = new EventEmitter<void>();

  private tramitesService = inject(TramitesService);
  private expedientesService = inject(ExpedientesService);
  isSaving = false;

  // Icons
  Check = faCheck;
  X = faTimes;

  async onSubmit() {
    if (!this.tramite || this.isSaving) return;
    this.isSaving = true;

    try {
      const fechaCierre = new Date();
      await this.tramitesService.updateTramite( this.tramite.id!, { estadoActual: 'Finalizado', fechaCierre });
      await this.expedientesService.cerrarTramite(this.tramite);
      alert('Trámite finalizado y expediente creado correctamente.');
      this.close.emit();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'No se pudo finalizar el trámite.');
    } finally {
      this.isSaving = false;
    }
  }
}