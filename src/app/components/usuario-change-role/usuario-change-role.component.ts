import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faShieldHalved, faTimes, faUser, faUserShield, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuario-change-role',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal max-w-md w-full">
        <div class="flex justify-between">
          <h2 class="card-title">Cambiar rol de "{{ user.username }}"</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <!-- Roles -->
          <div class="flex gap-4">
            <!-- Super Admin -->
            <label for="rol1" class="relative group w-full border border-neutral-400 text-neutral-400 p-4 rounded-3xl cursor-pointer select-none duration-300 hover:border-main hover:text-main hover:bg-main/10 has-[:checked]:border-main has-[:checked]:text-main has-[:checked]:bg-main/10">
              <div class="absolute top-3 left-3">
                <div class="border border-neutral-400 p-0.5 rounded-full duration-300 group-hover:border-main group-has-[:checked]:border-main">
                  <div class="h-2 w-2 rounded-full duration-300 bg-transparent group-hover:bg-main group-has-[:checked]:bg-main"></div>
                </div>
              </div>
              <div class="flex flex-col items-center">
                <fa-icon [icon]="Super" class="text-2xl"></fa-icon>
                <span class="text-xs">Super Admin</span>
                <input type="radio" id="rol1" formControlName="role" value="SUPERADMIN" class="hidden">
              </div>
            </label>
            <!-- Boss -->
            <label for="rol2" class="relative group w-full border border-neutral-400 text-neutral-400 p-4 rounded-3xl cursor-pointer select-none duration-300 hover:border-main hover:text-main hover:bg-main/10 has-[:checked]:border-main has-[:checked]:text-main has-[:checked]:bg-main/10">
              <div class="absolute top-3 left-3">
                <div class="border border-neutral-400 p-0.5 rounded-full duration-300 group-hover:border-main group-has-[:checked]:border-main">
                  <div class="h-2 w-2 rounded-full duration-300 bg-transparent group-hover:bg-main group-has-[:checked]:bg-main"></div>
                </div>
              </div>
              <div class="flex flex-col items-center">
                <fa-icon [icon]="Boss" class="text-2xl"></fa-icon>
                <span class="text-xs">Jefe</span>
                <input type="radio" id="rol2" formControlName="role" value="BOSS" class="hidden">
              </div>
            </label>
            <!-- Operator -->
            <label for="rol3" class="relative group w-full border border-neutral-400 text-neutral-400 p-4 rounded-3xl cursor-pointer select-none duration-300 hover:border-main hover:text-main hover:bg-main/10 has-[:checked]:border-main has-[:checked]:text-main has-[:checked]:bg-main/10">
              <div class="absolute top-3 left-3">
                <div class="border border-neutral-400 p-0.5 rounded-full duration-300 group-hover:border-main group-has-[:checked]:border-main">
                  <div class="h-2 w-2 rounded-full duration-300 bg-transparent group-hover:bg-main group-has-[:checked]:bg-main"></div>
                </div>
              </div>
              <div class="flex flex-col items-center">
                <fa-icon [icon]="Operator" class="text-2xl"></fa-icon>
                <span class="text-xs">Usuario</span>
                <input type="radio" id="rol3" formControlName="role" value="OPERATOR" class="hidden">
              </div>
            </label>
          </div>
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || isSaving" class="btn bg-sky-900 hover:bg-sky-900/80 text-white disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isSaving) { <span class="spin"></span> Actualizando... } @else { <fa-icon [icon]="Shield"></fa-icon>Cambiar }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class UsuarioChangeRoleComponent {
  @Input() user!: { uid: string, username: string, role: string, dependenciaId: string };
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);

  isSaving = false;

  form = this.fb.group({
    role: ['OPERATOR', Validators.required],
  });

  ngOnInit() {
    this.form.patchValue({ role: this.user.role });
  }

  // Icons
  Super = faUserShield;
  Boss = faUserTie;
  Operator = faUser;
  Shield = faShieldHalved;
  X = faTimes;

  async onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const newRole = this.form.value.role;
      try {
        await this.usuariosService.changeRole(this.user.uid, newRole!).then((res: any) => {
          alert("Rol de " + res.data.username + " actualizado correctamente.");
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