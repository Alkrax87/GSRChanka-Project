import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-usuario-modal',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">{{ usuario ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <p class="font-semibold text-neutral-700 -mb-1.5 text-sm">Datos Personales</p>
          <!-- Nombres -->
          <div>
            <label for="nombres" class="relative">
              <input id="nombres" type="text" formControlName="nombres" placeholder="" class="input peer cursor-text">
              <span class="input-base-label">Nombres</span>
            </label>
          </div>
          <!-- Apellidos -->
          <div>
            <label for="apellidos" class="relative">
              <input id="apellidos" type="text" formControlName="apellidos" placeholder="" class="input peer cursor-text">
              <span class="input-base-label">Apellidos</span>
            </label>
          </div>
          <!-- Abreviatura -->
          <div>
            <label for="abreviatura" class="relative">
              <input id="abreviatura" type="text" formControlName="abreviatura" placeholder="" class="input peer cursor-text">
              <span class="input-base-label">Abreviatura</span>
            </label>
          </div>
          <!-- Telefono -->
          <div>
            <label for="telefono" class="relative">
              <input id="telefono" type="tel" inputmode="numeric" formControlName="telefono" placeholder="" class="input peer cursor-text">
              <span class="input-base-label">Telefono</span>
            </label>
          </div>
          <!-- Correo -->
          <div>
            <label for="correo" class="relative">
              <input id="correo" type="email" formControlName="correo" placeholder="" class="input peer cursor-text">
              <span class="input-base-label">Correo</span>
            </label>
          </div>
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
          @if (!usuario) {
            <p class="font-semibold text-neutral-700 -mb-1.5 text-sm">Credenciales</p>
            <!-- Usuario -->
            <div>
              <label for="usuario" class="relative">
                <input id="usuario" type="text" formControlName="usuario" placeholder="" class="input peer cursor-text">
                <span class="input-base-label">Usuario</span>
              </label>
            </div>
            <!-- Contraseña -->
            <div>
              <label for="contrasena" class="relative">
                <input id="contrasena" type="password" formControlName="contrasena" placeholder="" class="input peer cursor-text">
                <span class="input-base-label">Contraseña</span>
              </label>
            </div>
          }
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            @if (usuario) {
              <button type="submit" [disabled]="form.invalid || isSaving" class="btn-edit disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isSaving) { <span class="spin"></span>Guardando... } @else { <fa-icon [icon]="Save"></fa-icon>Guardar }
              </button>
            } @else {
              <button type="submit" [disabled]="form.invalid || isSaving" class="btn-add disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isSaving) { <span class="spin"></span> Agregando... } @else { <fa-icon [icon]="Add"></fa-icon>Agregar }
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
  dependencias = inject(DependenciasService).dependencias;
  isSaving = false;

  form = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    abreviatura: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    correo: ['', [Validators.required, Validators.email]],
    dependenciaId: ['', Validators.required],
    usuario: ['', Validators.required],
    contrasena: [''],
  });

  // Icons
  Add = faPlus;
  Save = faFloppyDisk;
  X = faTimes;

  ngOnInit() {
    if (!this.usuario) {
      this.form.get('contrasena')?.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      this.form.patchValue(this.usuario);
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const usuarioForm = this.form.value as Usuario;

      if (this.usuario?.id) {
        try {
          await this.usuariosService.updateUsuario(
            this.usuario.id,
            this.form.value.nombres!,
            this.form.value.apellidos!,
            this.form.value.abreviatura!,
            this.form.value.telefono!,
            this.form.value.correo!,
            this.form.value.dependenciaId!
          ).then((res: any) => {
            alert("Usuario " + res.data.username + " actualizado correctamente.");
            this.isSaving = false;
            this.close.emit();
          });
        } catch (error) {
          alert(error);
          this.isSaving = false;
        }
      } else {
        try {
          await this.usuariosService.addUsuario(usuarioForm).then((res: any) => {
            alert("Usuario " + res.data.username + " creado correctamente.");
            this.isSaving = false;
            this.close.emit();
          });
        } catch (error) {
          alert(error);
          this.isSaving = false;
        }
      }
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  }
}