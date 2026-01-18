import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faEye, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../../../services/usuarios.service';
import { BreadcrumbComponent } from "../../../../components/breadcrumb/breadcrumb.component";
import { TableComponent } from '../../../../components/table/table.component';
import { UsuarioModalComponent } from '../../../../components/usuario-modal/usuario-modal.component';
import { UsuarioProfileComponent } from '../../../../components/usuario-profile/usuario-profile.component';
import { ConfirmacionEliminarModalComponent } from '../../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component';
import { Usuario } from '../../../../interfaces/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [FontAwesomeModule, BreadcrumbComponent, TableComponent, UsuarioModalComponent, UsuarioProfileComponent, ConfirmacionEliminarModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-10 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Usuarios'"></app-breadcrumb>
      <div class="flex items-center -mt-3 justify-between">
        <h1 class="text-main text-4xl font-bold">USUARIOS</h1>
        <button (click)="onAdd()" type="button" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar
        </button>
      </div>
      <!-- Table -->
      <app-table
        [tableConstructor]="tableHeaders"
        [data]="usuarios()"
        [actions]="tableActions"
        (action)="handleAction($event)"
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
  usuarios = this.usuariosService.usuarios;

  // Table
  tableHeaders = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'areaId', label: 'Area', isArea: true },
    { key: 'usuario', label: 'Usuario' },
  ];
  tableActions = [
    { action: 'show', icon: faEye, color: 'text-main', title: 'Ver'},
    { action: 'edit', icon: faEdit, color: 'text-yellow-400', title: 'Editar'},
    { action: 'delete', icon: faTrash, color: 'text-red-600', title: 'Eliminar'},
  ]

  // Modals
  isUserModalOpen = signal(false);
  isUserProfileOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedUsuario = signal<Usuario | null>(null);

  // Icons
  Add = faPlus;

  handleAction({action, item}: { action: string; item: any }) {
    switch (action) {
      case 'show':
        this.onShow(item);
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

  onEdit(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isUserModalOpen.set(true);
  }

  onDelete(usuario: Usuario) {
    this.selectedUsuario.set(usuario);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedUsuario()?.id) {
      this.usuariosService.deleteUsuario(this.selectedUsuario()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}