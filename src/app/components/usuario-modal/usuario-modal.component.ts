import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { RolesService } from '../../services/roles.service';
import { Usuario } from '../../interfaces/usuario';
import { Rol } from '../../interfaces/rol';
import { Subscription } from 'rxjs';

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
                  <option value="" disabled selected hidden></option>
                  @for (rol of roles; track $index) {
                    <option [value]="rol.id" class="hover:bg-main hover:text-red-700 h-20">{{ rol.nombre }}</option>
                  }
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Rol</span>
              </label>
            </div>
            @if (!usuario) {
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
              <div>
                <label for="confirmPassword" class="relative">
                  <input id="confirmPassword" type="password" formControlName="confirmPassword" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Confirmar contraseña</span>
                </label>
              </div>
            }
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

  private rolesSubscription: Subscription | null = null;
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
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
    password: [''],
    confirmPassword: [''],
  });

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;

  ngOnInit() {
    if (!this.usuario) {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
      this.form.setValidators(this.passwordsMatch);
    }

    this.rolesSubscription = this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        if (this.usuario) {
          const rolId = this.roles.find(r => r.nombre === this.usuario!.rol)?.id;
          this.form.patchValue({ ...this.usuario, rol: rolId });
        }
      }
    });
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  async save() {
    if (this.form.invalid) return;

    if (this.usuario?.id) {
      const oldRolId = this.roles.find((rol) => rol.nombre === this.usuario?.rol)?.id;
      const updatedUsuario: Usuario = {
        auth: this.usuario.auth,
        dni: this.form.value.dni!,
        nombres: this.form.value.nombres!,
        apellidos: this.form.value.apellidos!,
        telefono: this.form.value.telefono!,
        correo: this.form.value.correo!,
        rol: this.form.value.rol!,
        usuario: this.form.value.usuario!,
      }

      await this.usuariosService.updateUser(this.usuario.id, updatedUsuario);

      if (oldRolId !== updatedUsuario.rol) {
        await this.rolesService.changeRolUserCounter(oldRolId!, -1);
        await this.rolesService.changeRolUserCounter(updatedUsuario.rol!, 1)
      }
    } else {
      const userCredentials: any = await this.authService.registerUser(this.form.value.usuario + '@gsrchanka.com', this.form.value.password!);
      const usuarioData: Usuario = {
        auth: userCredentials.user.uid,
        dni: this.form.value.dni!,
        nombres: this.form.value.nombres!,
        apellidos: this.form.value.apellidos!,
        telefono: this.form.value.telefono!,
        correo: this.form.value.correo!,
        rol: this.form.value.rol!,
        usuario: this.form.value.usuario!,
      }

      await this.usuariosService.addUser(usuarioData);
      await this.rolesService.changeRolUserCounter(usuarioData.rol!, 1);
    }

    this.close.emit();
  }

  ngOnDestroy() {
    this.rolesSubscription?.unsubscribe();
    this.form.reset();
  }
}