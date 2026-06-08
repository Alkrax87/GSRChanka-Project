import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { Inversion } from '../../interfaces/inversion';
import { InversionService } from '../../services/inversion.service';
@Component({
  selector: 'app-inversion-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">
          {{ inversion ? 'Editar Inversion' : 'Crear Inversion' }}
        </h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4 my-4">
            <div>
              <label for="cui" class="relative">
                <input id="cui" type="text" formControlName="cui" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">CUI</span>
              </label>
            </div>
            <div>
              <label for="nombreinversion" class="relative">
                <input id="nombreinversion" type="text" formControlName="nombreinversion" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombre Inversion</span>
              </label>
            </div>
            <div>
              <label for="residente" class="relative">
                <select id="residente" formControlName="residente" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <div class="rounded-lg overflow-hidden">
                    <option value="" disabled selected hidden></option>
                    @for (residente of usuarios(); track $index) {
                      <option [value]="residente.id" class="hover:bg-main hover:text-red-700 h-20"> {{ residente.nombres }} {{ residente.apellidos }}</option>
                    }
                  </div>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Residente</span>
              </label>
            </div>
            <div>
              <label for="supervisor" class="relative">
                <select id="supervisor" formControlName="supervisor" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <div class="rounded-lg overflow-hidden">
                    <option value="" disabled selected hidden></option>
                    @for (supervisor of usuarios(); track $index) {
                      <option [value]="supervisor.id" class="hover:bg-main hover:text-red-700 h-20"> {{ supervisor.nombres }} {{ supervisor.apellidos }}</option>
                    }
                  </div>
                </select>
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Supervisor</span>
              </label>
            </div>
            <div>
              <label for="provincia" class="relative">
                <input id="provincia" type="text" formControlName="provincia" value="Andahuaylas" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Provincia</span>
              </label>
            </div>
            <div>
              <label for="distrito" class="relative">
                <select
                  id="distrito"
                  formControlName="distrito"
                  class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="" disabled selected hidden></option>
                  <option>Andahuaylas</option>
                  <option>Andarapa</option>
                  <option>Chiara</option>
                  <option>Huancarama</option>
                  <option>Huancaray</option>
                  <option>Huayana</option>
                  <option>José María Arguedas</option>
                  <option>Kaquiabamba</option>
                  <option>Kishuara</option>
                  <option>Pacobamba</option>
                  <option>Pacucha</option>
                  <option>Pampachiri</option>
                  <option>Pomacocha</option>
                  <option>San Antonio de Cachi</option>
                  <option>San Jerónimo</option>
                  <option>San Miguel de Chaccrapampa</option>
                  <option>Santa María de Chicmo</option>
                  <option>Talavera de la Reyna</option>
                  <option>Tumay Huaraca</option>
                  <option>Turpo</option>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6"> Distrito</span>
              </label>
            </div>
            <div>
              <label for="fecha_inicio" class="relative">
                <input id="fecha_inicio" type="date" formControlName="fecha_inicio" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Fecha Inicio</span>
              </label>
            </div>
            <div>
              <label for="fecha_final" class="relative">
                <input id="fecha_final" type="datetime-local" formControlName="fecha_final" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Fecha Final</span>
              </label>
            </div>
            <div>
              <label for="prosupuesto_ejecucion" class="relative">
                <input id="prosupuesto_ejecucion" type="number" formControlName="prosupuesto_ejecucion" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Presupuesto Ejecucion</span>
              </label>
            </div>
            <div>
              <label for="miembros_inversion" class="relative">
                <input id="miembros_inversion" type="text" formControlName="miembros_inversion" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Miembros Area</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            @if (inversion) {
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
  styles: ``
})
export class InversionModalComponent {
  @Input() inversion: Inversion | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private inversionService = inject(InversionService);
  private usuariosService = inject(UsuariosService);
  usuarios = this.usuariosService.usuarios;

  form = this.fb.group({
    cui: ['', Validators.required],
    nombreinversion: ['', Validators.required],
    residente: ['', Validators.required],
    supervisor: ['', Validators.required],
    distrito: ['', Validators.required],
    provincia: ['andahuaylas', Validators.required],
    fecha_inicio: [null as Date | null, Validators.required],
    fecha_final: [null as Date | null, Validators.required],
    prosupuesto_ejecucion: [0, Validators.required],
    miembros_inversion: ['', Validators.required],
    
  });

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;

  ngOnInit() {
    if (this.inversion) {
      const residente = this.usuarios().find(
        u => `${u.nombres} ${u.apellidos}`.trim() === this.inversion!.residente
      );
      const supervisor = this.usuarios().find(
        u => `${u.nombres} ${u.apellidos}`.trim() === this.inversion!.supervisor
      );

      this.form.patchValue({
        ...this.inversion,
        residente: residente ? residente.id : '',
        supervisor: supervisor ? supervisor.id : '',
      });
    }
  }
  

  async save() {
    if (this.form.invalid) return;

    const value = this.form.value as Inversion;

    if (this.inversion?.id) {
      // Si es edición
      await this.inversionService.updateInversion(this.inversion.id, value);
    } else {
      // Si es creación
      await this.inversionService.addInversion(value);
    }

    // Cerrar modal después de guardar
    this.close.emit();
  }
}
