import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../../../services/usuarios.service';
import { RolesService } from '../../../../services/roles.service';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../../../../components/table/table.component';
import { UsuarioModalComponent } from '../../../../components/usuario-modal/usuario-modal.component';
import { UsuarioProfileComponent } from '../../../../components/usuario-profile/usuario-profile.component';
import { ConfirmacionEliminarModalComponent } from '../../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component';
import { Usuario } from '../../../../interfaces/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [FontAwesomeModule, UsuarioModalComponent, ConfirmacionEliminarModalComponent, TableComponent, UsuarioProfileComponent],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <p class="text-neutral-400 text-xs font-semibold">
        <span class="text-main">Seguridad</span> &nbsp;&nbsp;/&nbsp;&nbsp; Usuarios
      </p>
      <div class="flex items-center -mt-5 justify-between">
        <h1 class="text-main text-4xl font-bold">USUARIOS</h1>
        <button (click)="openCreate()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar Usuario
        </button>
      </div>
      <app-table
        [tableConstructor]="tableHeaders"
        [data]="usuarios()"
        (onShow)="openShow($event)"
        (onEdit)="openEdit($event)"
        (onDelete)="openDelete($event)"
      ></app-table>
    </div>

    @if (isUserModalOpen()) {
      <app-usuario-modal
        [usuario]="selectedUsuario()"
        (close)="isUserModalOpen.set(false)"
      ></app-usuario-modal>
    }

    @if (isUserProfileOpen()) {
      <app-usuario-profile
        [usuario]="selectedUsuario()!"
        (close)="isUserProfileOpen.set(false)"
      ></app-usuario-profile>
    }

    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar al usuario ' + selectedUsuario()!.usuario + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class UsuariosComponent {
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesService);

  tableHeaders = [
    { key: 'dni', label: 'DNI' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'rol', label: 'Rol' },
    { key: 'usuario', label: 'Usuario' },
  ];

  // Signals
  usuarios = signal<Usuario[]>([]);
  isUserModalOpen = signal(false);
  isUserProfileOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedUsuario = signal<Usuario | null>(null);

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;
  Delete = faTrash;

  constructor() {
    combineLatest([
      this.usuariosService.getUsers(),
      this.rolesService.getRoles(),
    ]).pipe(takeUntilDestroyed()).subscribe({
      next: ([usuarios, roles]) => {
        this.usuarios.set(
          usuarios.map((usuario) => {
            const rol = roles.find((rol) => rol.id === usuario.rol);

            return {
              ...usuario,
              rol: rol?.nombre ?? 'Sin rol',
            };
          })
        );
      },
    });
  }

  openCreate() {
    this.selectedUsuario.set(null);
    this.isUserModalOpen.set(true);
  }

  openShow(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserProfileOpen.set(true);
  }

  openEdit(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserModalOpen.set(true);
  }

  openDelete(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedUsuario()?.id) {
      this.usuariosService.deleteUser(this.selectedUsuario()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}