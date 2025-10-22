import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaService } from '../../services/area.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Area } from '../../interfaces/area';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-area-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">
          {{ area ? 'Editar Area' : 'Crear Area' }}
        </h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4 my-4">
            <div>
              <label for="nombrearea" class="relative">
                <input id="nombrearea" type="text" formControlName="nombrearea" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombre Area</span>
              </label>
            </div>
            <div>
              <label for="responsable" class="relative">
                <select id="responsable" formControlName="responsable" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <div class="rounded-lg overflow-hidden">
                    <option value="" disabled selected hidden></option>
                    @for (responsable of usuarios; track $index) {
                      <option [value]="responsable.nombres + ' ' + responsable.apellidos" class="hover:bg-main hover:text-red-700 h-20"> {{ responsable.nombres }} {{ responsable.apellidos }}</option>
                    }
                  </div>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Responsable</span>
              </label>
            </div>
            <div>
              <label for="miembros_area" class="relative">
                <input id="miembros_area" type="text" formControlName="miembros_area" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Miembros Area</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            @if (area) {
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
export class AreaModalComponent {
  @Input() area: Area | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private areasService = inject(AreaService);
  private usuariosService = inject(UsuariosService);
  usuarios: Usuario[] = [];

  form = this.fb.group({
    nombrearea: ['', Validators.required],
    responsable: ['', Validators.required],
    miembros_area: ['', Validators.required],
  });

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;

  ngOnInit() {
    if (this.area) {
      this.form.patchValue(this.area);
    }
    this.usuariosService.getUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const value = this.form.value as Area;

    if (this.area?.id) {
      this.areasService.updateArea(this.area.id, value).then(() => this.close.emit());
    } else {
      this.areasService.addArea(value).then(() => this.close.emit());
    }
  }
}