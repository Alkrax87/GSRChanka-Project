import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTags, faUser } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../services/usuarios.service';
import { Area } from '../../interfaces/area';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-area-show-modal',
  imports: [FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl p-6 w-96 shadow-lg">
        <h2 class="text-xl font-semibold">{{ area.nombre }}</h2>
        <p class="text-neutral-400 text-sm">Usuarios asignados <b class="text-neutral-700">({{ filteredUsuarios.length }})</b></p>
        @if (filteredUsuarios.length > 0) {
          <div class="overflow-x-auto shadow-md rounded-md border my-4">
            <table class="w-full">
              <thead class="bg-main text-white">
                <tr class="h-8 text-sm">
                  <th class="cursor-pointer w-full text-start px-3">Nombre y Apellidos</th>
                </tr>
              </thead>
              <tbody>
                @for (usuario of filteredUsuarios; track $index) {
                  <tr class="h-8 hover:bg-neutral-100">
                    <td class="px-3">{{ usuario.nombres + ' ' + usuario.apellidos }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
        <div class="flex justify-end gap-2">
          <button type="button" (click)="close.emit()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AreaShowModalComponent {
  @Input() area!: Area;
  @Output() close = new EventEmitter<void>();
  usuarios = inject(UsuariosService).usuarios;
  filteredUsuarios: Usuario[] = [];

  ngOnInit() {
    this.filteredUsuarios = this.usuarios().filter(usuario => usuario.areaId === this.area.id);
  }

  tableHeaders = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
  ];

  User = faUser;
  Rol = faTags;
}