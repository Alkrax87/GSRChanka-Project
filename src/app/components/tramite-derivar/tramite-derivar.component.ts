import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Movimiento, Tramite } from '../../interfaces/tramite';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPaperPlane, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TramitesService } from '../../services/tramites.service';
import { AuthService } from '../../services/auth.service';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-tramite-derivar',
  imports: [FaIconComponent, ReactiveFormsModule],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">Derivar Trámite</h2>
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
          <!-- Observaciones -->
          <div>
            <label for="observaciones" class="relative">
              <textarea id="observaciones" formControlName="observaciones" placeholder=" " rows="4" class="bg-white text-neutral-700 border focus:border-main focus:text-main cursor-text px-5 py-3 peer w-full rounded-2xl shadow-sm duration-100 outline-none resize-none"></textarea>
              <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text absolute start-3 -top-[92px] px-2 text-xs font-semibold transition-transform -translate-y-[22px] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-[22px]">Observaciones</span>
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
export class TramiteDerivarComponent {
  @Input() tramite!: Tramite;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tramitesService = inject(TramitesService);
  dependencias = (inject(DependenciasService).dependencias);
  currentUser = inject(AuthService).usuarioLogged;
  isSaving = false;

  form = this.fb.group({
    dependenciaId: ['', Validators.required],
    observaciones: [''],
  });

  // Icons
  Send = faPaperPlane;
  X = faTimes;

  onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const dependenciaDestino = this.form.value.dependenciaId;
      const observaciones = this.form.value.observaciones || '';

      try {
        if (this.tramite && dependenciaDestino) {
          const emisorAnterior = this.tramite.trazabilidad[0].dependenciaEmisor;
          const esDevolucion = dependenciaDestino === emisorAnterior;

          const trazabilidadClonada = [...this.tramite.trazabilidad];
          trazabilidadClonada[0] = {
            ...trazabilidadClonada[0],
            estado: 'Derivado',
            fechaSalida: new Date()
          };

          const nuevoMovimiento: Movimiento = {
            usuarioEmisor: this.currentUser()!.displayName,
            dependenciaEmisor: this.currentUser()!.dependenciaId,
            dependenciaReceptor: dependenciaDestino,
            fechaEnvio: new Date(),
            fechaRecepcion: null,
            fechaSalida: null,
            estado: esDevolucion ? 'Devuelto' : 'Enviado',
            observaciones: observaciones,
          }

          const dependenciasLimpias = Array.from(
            new Set([...this.tramite.dependenciasInvolucradas, dependenciaDestino])
          );

          const tramiteDerivado: Partial<Tramite> = {
            dependenciaActual: dependenciaDestino,
            estadoActual: esDevolucion ? 'Devuelto' : 'Pendiente',
            dependenciasInvolucradas: dependenciasLimpias,
            trazabilidad: [nuevoMovimiento, ...trazabilidadClonada],
          };

          this.tramitesService.updateTramite(this.tramite.id!, tramiteDerivado).then(() => {
            alert(esDevolucion ? "Trámite devuelto correctamente." : "Trámite derivado correctamente.");
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