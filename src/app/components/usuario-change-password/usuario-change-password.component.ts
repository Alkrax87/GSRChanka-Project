import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faKey, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuario-change-password',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal max-w-md w-full">
        <div class="flex justify-between">
          <h2 class="card-title">Cambiar contraseña de "{{ user.username }}"</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <!-- Contraseña -->
          <div>
            <label for="contrasena" class="relative">
              <input id="contrasena" type="password" formControlName="newPassword" placeholder="" class="input peer cursor-text">
              <span class="input-base-label">Nueva Contraseña</span>
            </label>
          </div>
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || isSaving" class="btn bg-purple-800 hover:bg-purple-800/80 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isSaving) { <span class="spin"></span> Actualizando... } @else { <fa-icon [icon]="Key"></fa-icon>Cambiar }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class UsuarioChangePasswordComponent {
  @Input() user!: { uid: string, username: string };
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);

  isSaving = false;

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Icons
  Key = faKey;
  X = faTimes;

  async onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const newPassword = this.form.value.newPassword;
      try {
        await this.usuariosService.changePassword(this.user.uid, newPassword!).then((res: any) => {
          alert("Contraseña de " + res.data.username + " actualizada correctamente.");
          this.isSaving = false;
          this.close.emit();
        });
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