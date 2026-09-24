import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Documento } from '../../interfaces/documento';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DependenciasService } from '../../services/dependencias.service';
import { TramitesService } from '../../services/tramites.service';
import { Tramite } from '../../interfaces/tramite';

@Component({
  selector: 'app-documento-send-modal',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">Enviar Documento</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <!-- Dependencia -->
          <div>
            <label for="dependenciaId" class="relative">
              <select id="dependenciaId" formControlName="dependenciaId" placeholder="" class="input peer cursor-pointer" required>
                <option value="" disabled selected hidden></option>
                @for (dependencia of dependencias(); track $index) {
                  <option class="text-sm" [value]="dependencia.id">{{ dependencia.nombre }}</option>
                }
              </select>
              <span class="input-select-label">Dependencia</span>
            </label>
          </div>
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || isSaving" class="btn-add disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isSaving) { <span class="spin"></span> Derivando... } @else { <fa-icon [icon]="Send"></fa-icon>Enviar }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class DocumentoSendModalComponent {
  @Input() documento: Documento | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tramitesService = inject(TramitesService);
  dependencias = inject(DependenciasService).dependencias;
  currentUser = inject(AuthService).usuarioLogged;
  isSaving = false;

  form = this.fb.group({
    dependenciaId: ['', Validators.required],
  });

  // Icons
  Send = faPaperPlane;
  X = faTimes;

  private generateTicketCode() {
    const date = new Date();

    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const random = Array.from({ length: 6 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

    return `TR-${year}${month}${day}-${random}`;
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const dependenciaDestino = this.form.value.dependenciaId;

      try {
        if (this.documento && dependenciaDestino) {
          const nuevoTicket = this.generateTicketCode();

          const tramiteNuevo: Tramite = {
            codigoTicket: nuevoTicket,
            dependenciaOrigen: this.documento.adjuntadoPorDependencia,
            documentoInicial: this.documento.id!,
            documentosAdjuntos: [this.documento.id!],
            dependenciaActual: dependenciaDestino!,
            estadoActual: 'Pendiente',
            trazabilidad: [
              {
                usuarioEmisor: this.currentUser()!.displayName,
                dependenciaEmisor: this.documento.adjuntadoPorDependencia,
                dependenciaReceptor: dependenciaDestino,
                fechaEnvio: new Date(),
                fechaRecepcion: null,
                fechaSalida: null,
                estado: 'Enviado'
              }
            ],
            dependenciasInvolucradas: [this.currentUser()!.dependenciaId, dependenciaDestino]
          }

          this.tramitesService.addTramite(tramiteNuevo).then(() => {
            alert(`Nuevo trámite creado correctamente.\nTicket: ${nuevoTicket}`);
            this.isSaving = false;
            this.close.emit();
          });
        }
      } catch (error) {
        alert(error);
        this.isSaving = false;
      }
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  }
}