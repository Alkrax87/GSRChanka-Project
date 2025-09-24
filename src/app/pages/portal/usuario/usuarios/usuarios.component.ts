import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UsuariosService } from '../../../../services/usuarios.service';
import { Usuario } from '../../../../interfaces/usuario';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UsuarioModalComponent } from "../../../../components/usuario-modal/usuario-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { TableComponent } from "../../../../components/table/table.component";

@Component({
  selector: 'app-usuarios',
  imports: [FontAwesomeModule, UsuarioModalComponent, ConfirmacionEliminarModalComponent, TableComponent],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <p class="text-neutral-400 text-xs font-semibold">
        <span class="text-main">Usuarios</span> &nbsp;&nbsp;/&nbsp;&nbsp; Usuarios
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
      ></app-table>
    </div>

    @if (isUserModalOpen()) {
      <app-usuario-modal
        [usuario]="selectedUsuario()"
        (close)="isUserModalOpen.set(false)"
      ></app-usuario-modal>
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

  tableHeaders = [
    {key: 'dni', label: 'DNI'},
    {key: 'nombres', label: 'Nombres'},
    {key: 'apellidos', label: 'Apellidos'},
    {key: 'telefono', label: 'Teléfono'},
    {key: 'correo', label: 'Correo'},
    {key: 'rol', label: 'Rol'},
    {key: 'usuario', label: 'Usuario'},
  ];

  // Signals
  usuarios = signal<Usuario[]>([]);
  isUserModalOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedUsuario = signal<Usuario | null>(null);

  // Icons
  Add = faPlus;
  Edit = faPenToSquare;
  Delete = faTrash;

  ngOnInit() {
    this.usuariosService.getUsers().subscribe({
      next: (data) => {
        this.usuarios.set(data);
      }
    });
  }

  openCreate() {
    this.selectedUsuario.set(null);
    this.isUserModalOpen.set(true);
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
