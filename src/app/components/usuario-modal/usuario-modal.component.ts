import { Component, EventEmitter, Inject, inject, Input, Output } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { RolesService } from '../../services/roles.service';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Rol } from '../../interfaces/rol';

@Component({
  selector: 'app-usuario-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">
          {{ usuario ? 'Editar Usuario' : 'Crear Usuario' }}
        </h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4 my-4">
            <div>
              <label for="dni" class="relative">
                <input id="dni" type="text" formControlName="dni" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">DNI</span>
              </label>
            </div>
            <div>
              <label for="nombres" class="relative">
                <input id="nombres" type="text" formControlName="nombres" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombres</span>
              </label>
            </div>
            <div>
              <label for="apellidos" class="relative">
                <input id="apellidos" type="text" formControlName="apellidos" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Apellidos</span>
              </label>
            </div>
            <div>
              <label for="telefono" class="relative">
                <input id="telefono" type="text" formControlName="telefono" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Telefono</span>
              </label>
            </div>
            <div>
              <label for="correo" class="relative">
                <input id="correo" type="email" formControlName="correo" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Correo</span>
              </label>
            </div>
            <div>
              <label for="rol" class="relative">
                <select id="rol" formControlName="rol" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <div class="rounded-lg overflow-hidden">
                    <option value="" disabled selected hidden></option>
                    @for (rol of roles; track $index) {
                      <option [value]="rol.id" class="hover:bg-main hover:text-red-700 h-20">{{ rol.nombre }}</option>
                    }
                  </div>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Rol</span>
              </label>
            </div>
            <div>
              <label for="usuario" class="relative">
                <input id="usuario" type="text" formControlName="usuario" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Usuario</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            @if (usuario) {
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
export class UsuarioModalComponent {
  @Input() usuario: Usuario | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesService);
  roles: Rol[] = [];

  form = this.fb.group({
    dni: ['', [Validators.required, Validators.maxLength(8)]],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.maxLength(9)]],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['', Validators.required],
    usuario: ['', Validators.required],
  });

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;

  ngOnInit() {
    if (this.usuario) {
      this.form.patchValue(this.usuario);
    }
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const value = this.form.value as Usuario;

    if (this.usuario?.id) {
      this.usuariosService.updateUser(this.usuario.id, value).then(() => this.close.emit());
    } else {
      this.usuariosService.addUser(value).then(() => this.close.emit());
    }
  }
}