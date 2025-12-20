import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Movimiento, Tramite } from '../../interfaces/tramite';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TramitesService } from '../../services/tramites.service';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tramite-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">
          {{ tramite ? 'Editar Trámite' : 'Crear Trámite' }}
        </h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4 my-4">
            @if (tramite?.areaActual === currentArea || !tramite) {
              <div>
                <label for="nombre" class="relative">
                  <input id="nombre" type="text" formControlName="nombre" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombre</span>
                </label>
              </div>
            }
            @if (tramite) {
              <div formArrayName="trazabilidad">
                <label formGroupName="0" for="prioridad" class="relative">
                  <select id="prioridad" formControlName="prioridad" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    <option value="" disabled selected hidden></option>
                    <option value="Sin Determinar">Sin determinar</option>
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Prioridad</span>
                </label>
              </div>
              <div formArrayName="trazabilidad">
                <label formGroupName="0" for="estado" class="relative">
                  <select id="estado" formControlName="estado" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    <option value="" disabled selected hidden></option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                  </select>
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Estado</span>
                </label>
              </div>
            }
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            @if (tramite) {
              <button type="submit" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
                <fa-icon [icon]="Edit"></fa-icon>&nbsp; Editar
              </button>
            } @else {
              <button type="submit" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
                <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteModalComponent {
  @Input() tramite: Tramite | null = null;
  @Input() currentArea!: string;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tramitesService = inject(TramitesService);

  form = this.fb.group({
    nombre: ['', Validators.required],
    trazabilidad: this.fb.array<Movimiento>([]),
  });

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;

  ngOnInit() {
    if (this.tramite) {
      const arr = this.form.get('trazabilidad') as FormArray;
      this.tramite.trazabilidad.forEach(mov => {
        arr.push(this.createMovimientoGroup(mov));
      });

      this.form.patchValue({
        nombre: this.tramite.nombre
      });
    } else {
      const arr = this.form.get('trazabilidad') as FormArray;
      arr.clear();
    }
  }

  createMovimientoGroup(mov?: Movimiento) {
    return this.fb.group({
      areaOrigen: [mov?.areaOrigen || ''],
      areaDestino: [mov?.areaDestino || ''],
      fechaIngreso: [mov?.fechaIngreso || ''],
      fechaSalida: [mov?.fechaSalida || ''],
      prioridad: [mov?.prioridad || 'Baja'],
      estado: [mov?.estado || 'Pendiente'],
      observaciones: [mov?.observaciones || ''],
    });
  }

  save() {
    if (this.form.invalid) return;

    const value = this.form.value as Tramite;

    if (this.tramite?.id) {
      this.tramitesService.updateTramite(this.tramite.id, value).then(() => this.close.emit());
    } else {
      value.areaActual = this.currentArea;
      value.areaCreacion = this.currentArea;
      value.estadoGlobal = 'Pendiente';
      value.trazabilidad = [{
        areaOrigen: this.currentArea,
        areaDestino: this.currentArea,
        fechaIngreso: new Date(),
        fechaSalida: null,
        prioridad: 'Sin Determinar',
        estado: 'Pendiente',
        observaciones: '',
      }]
      this.tramitesService.addTramite(value).then(() => this.close.emit());
    }
  }
}