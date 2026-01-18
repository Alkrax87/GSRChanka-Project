import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { AreaService } from '../../services/area.service';

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
            <p class="font-semibold -mb-1.5">Datos Personales</p>
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
              <label for="areaId" class="relative">
                <select id="areaId" formControlName="areaId" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="" disabled selected hidden></option>
                  @for (area of areas(); track $index) {
                    <option [value]="area.id">{{ area.nombre }}</option>
                  }
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Área</span>
              </label>
            </div>
            @if (!usuario) {
              <p class="font-semibold -mb-1.5">Credenciales</p>
              <div>
                <label for="usuario" class="relative">
                  <input id="usuario" type="text" formControlName="usuario" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Usuario</span>
                </label>
              </div>
              <div>
                <label for="password" class="relative">
                  <input id="password" type="password" formControlName="password" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Contraseña</span>
                </label>
              </div>
            }
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            @if (usuario) {
              <button type="submit" [disabled]="form.invalid || isSaving" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
                @if (isSaving) {
                  <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Guardando...
                } @else {
                  <fa-icon [icon]="Save"></fa-icon> Guardando
                }
              </button>
            } @else {
              <button type="submit" [disabled]="form.invalid || isSaving" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
                @if (isSaving) {
                  <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Agregando...
                } @else {
                  <fa-icon [icon]="Add"></fa-icon> Agregar
                }
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
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  areas = inject(AreaService).areas;
  isSaving = false;

  form = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    correo: ['', [Validators.required, Validators.email]],
    areaId: ['', Validators.required],
    usuario: ['', Validators.required],
    password: [''],
  });

  // Icons
  Add = faPlus;
  Save = faFloppyDisk;

  ngOnInit() {
    if (!this.usuario) {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      this.form.patchValue(this.usuario);
    }
  }

  async save() {
    if (this.form.invalid) return;

    this.isSaving = true;
    const usuario = {
      nombres: this.form.value.nombres!,
      apellidos: this.form.value.apellidos!,
      telefono: this.form.value.telefono!,
      correo: this.form.value.correo!,
      areaId: this.form.value.areaId!,
      usuario: this.form.value.usuario!,
    }

    if (this.usuario?.id) {
      this.usuariosService.updateUsuario(this.usuario.id, usuario).then(() => this.close.emit());
    } else {
      const userCredentials: any = await this.authService.registerUser(this.form.value.usuario + '@gsrchanka.com', this.form.value.password!);
      const newUser: Usuario = {
        id: userCredentials.user.uid,
        ...usuario,
      }

      await this.usuariosService.addUsuario(newUser).then(() => {
        this.isSaving = false;
        this.close.emit();
      });
    }
  }
}