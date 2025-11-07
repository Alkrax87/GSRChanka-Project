import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Tramite } from '../../interfaces/tramite';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TramitesService } from '../../services/tramites.service';
import { formatDate } from '@angular/common';
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
            <div>
              <label for="nombre" class="relative">
                <input id="nombre" type="text" formControlName="nombre" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombre</span>
              </label>
            </div>
            <div>
              <label for="descripcion" class="relative">
                <input id="descripcion" type="text" formControlName="descripcion" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Descripción</span>
              </label>
            </div>
            @if (tramite?.id) {
              <div>
                <label formGroupName="ubicacionActual" for="estado" class="relative">
                  <select id="estado" formControlName="estado" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    <option value="" disabled selected hidden></option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Área Destino</span>
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
    descripcion: ['', Validators.required],
    origen: this.fb.group({
      area: [''],
      fecha: [''],
    }),
    ubicacionActual: this.fb.group({
      area: [''],
      fechaIngreso: [''],
      estado: ['Pendiente', Validators.required],
    }),
    trazabilidadAreas: this.fb.control<Tramite['trazabilidadAreas']>([]),
  });

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;

  ngOnInit() {
    if (this.tramite) {
      this.form.patchValue(this.tramite)
    }
  }

  save() {
    if (this.form.invalid) {
      console.log("Formulario con errores");
      return;
    };

    const now = formatDate(new Date(), 'EEE dd MMM, HH:mm', 'es');
    const value = this.form.value as Tramite;

    if (this.tramite?.id) {
      this.tramitesService.updateTramite(this.tramite.id, value).then(() => this.close.emit());
    } else {
      value.origen = {
        area: this.currentArea,
        fecha: now.replace(/\b\w/g, l => l.toUpperCase()),
      }
      value.ubicacionActual = {
        area: this.currentArea,
        fechaIngreso: now.replace(/\b\w/g, l => l.toUpperCase()),
        estado: 'Pendiente',
      }
      value.trazabilidadAreas.push({
        area: this.currentArea,
        fechaIngreso: now.replace(/\b\w/g, l => l.toUpperCase()),
        estado: 'Pendiente',
      });
      this.tramitesService.addTramite(value).then(() => this.close.emit());
    }
  }
}