import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faEye, faKey, faPlus, faShieldHalved, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../../services/usuarios.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../components/table/table.component';
import { UsuarioModalComponent } from '../../../components/usuario-modal/usuario-modal.component';
import { UsuarioProfileComponent } from '../../../components/usuario-profile/usuario-profile.component';
import { ConfirmacionEliminarModalComponent } from '../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component';
import { UsuarioChangeRoleComponent } from "../../../components/usuario-change-role/usuario-change-role.component";
import { UsuarioChangePasswordComponent } from "../../../components/usuario-change-password/usuario-change-password.component";
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [FaIconComponent, BreadcrumbComponent, TableComponent, UsuarioModalComponent, UsuarioProfileComponent, ConfirmacionEliminarModalComponent, UsuarioChangePasswordComponent, UsuarioChangeRoleComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Usuarios'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Usuarios</h1>
        <button (click)="onAdd()" type="button" class="btn-add">
          <fa-icon [icon]="Add"></fa-icon>Nuevo Usuario
        </button>
      </div>
      <!-- Table -->
      <div class="card">
        <app-table
          [tableConstructor]="tableHeaders"
          [data]="usuarios()"
          [actions]="tableActions"
          (action)="handleAction($event)"
        ></app-table>
      </div>
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
    @if (isUserChangeRoleOpen()) {
      <app-usuario-change-role
        [user]="{ uid: selectedUsuario()!.id!, username: selectedUsuario()!.usuario, role: selectedUsuario()!.rol, dependenciaId: selectedUsuario()!.dependenciaId }"
        (close)="isUserChangeRoleOpen.set(false)"
      ></app-usuario-change-role>
    }
    @if (isUserChangePasswordOpen()) {
      <app-usuario-change-password
        [user]="{ uid: selectedUsuario()!.id!, username: selectedUsuario()!.usuario }"
        (close)="isUserChangePasswordOpen.set(false)"
      ></app-usuario-change-password>
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
  usuarios = this.usuariosService.usuarios;

  // Table
  tableHeaders = [
    { key: 'id', label: 'ID', isId: true },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'abreviatura', label: 'Code' },
    { key: 'dependenciaId', label: 'Dependencia', isDependencia: true },
    { key: 'usuario', label: 'Usuario' },
    { key: 'rol', label: 'Rol', isRole: true },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
  ];
  tableActions = [
    { action: 'show', icon: faEye, color: 'text-main', title: 'Ver' },
    { action: 'role', icon: faShieldHalved, color: 'text-sky-900', title: 'Cambiar rol' },
    { action: 'password', icon: faKey, color: 'text-purple-800', title: 'Cambiar contraseña' },
    { action: 'edit', icon: faEdit, color: 'text-yellow-400', title: 'Editar' },
    { action: 'delete', icon: faTrash, color: 'text-red-600', title: 'Eliminar' },
  ];

  // Modals
  isUserModalOpen = signal(false);
  isUserProfileOpen = signal(false);
  isUserChangeRoleOpen = signal(false);
  isUserChangePasswordOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedUsuario = signal<Usuario | null>(null);

  // Icons
  Add = faPlus;

  handleAction({ action, item }: { action: string; item: any }) {
    switch (action) {
      case 'show':
        this.onShow(item);
        break;
      case 'role':
        this.onChangeRole(item);
        break;
      case 'password':
        this.onChangePassword(item);
        break;
      case 'edit':
        this.onEdit(item);
        break;
      case 'delete':
        this.onDelete(item);
        break;
    }
  }

  onAdd() {
    this.selectedUsuario.set(null);
    this.isUserModalOpen.set(true);
  }

  onShow(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserProfileOpen.set(true);
  }

  onChangeRole(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserChangeRoleOpen.set(true);
  }

  onChangePassword(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserChangePasswordOpen.set(true);
  }

  onEdit(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserModalOpen.set(true);
  }

  onDelete(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isConfirmOpen.set(true);
  }

  async confirmDelete() {
    if (this.selectedUsuario()?.id) {
      try {
        await this.usuariosService.deleteUsuario(this.selectedUsuario()!.id!).then((res: any) => {
          alert("Usuario " + res.data.username + " eliminado correctamente.");
          this.isConfirmOpen.set(false);
        });
      } catch (error) {
        alert(error);
      }
    }
  }
}