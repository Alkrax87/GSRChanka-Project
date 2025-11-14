import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Area } from '../../interfaces/area';
import { faTags, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Usuario } from '../../interfaces/usuario';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-area-show-modal',
  imports: [FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-[480px] shadow-xl">
        <h2 class="text-xl font-semibold">
          {{ area.nombre }}
        </h2>
        <div class="flex flex-col gap-4 my-3">
          <div>
            <h3 class="text-main font-semibold">Información del Área</h3>
            <div class="border border-main rounded-xl p-4 flex gap-4 justify-between">
              <div class="w-1/2">
                <p class="text-main font-semibold text-xs"><fa-icon [icon]="User"></fa-icon> Responsable</p>
                <p class="text-neutral-600 text-sm">{{ area.responsable }}</p>
              </div>
              <div class="w-1/2">
                <p class="text-main font-semibold text-xs"><fa-icon [icon]="Rol"></fa-icon> Rol Asociado</p>
                <p class="text-neutral-600 text-sm">{{ area.rolAsociado }}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-main font-semibold">Usuarios asignados ({{ usuarios.length }})</h3>
            @if (usuarios.length > 0) {
              <div class="overflow-x-auto shadow-md rounded-2xl border">
                <table class="w-full">
                  <thead class="bg-main text-white">
                    <tr class="h-10 text-sm">
                      <th class="cursor-pointer text-start px-3">Nombre y Apellidos</th>
                      <th class="cursor-pointer text-start px-3">Teléfono</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (usuario of usuarios; track $index) {
                      <tr class="h-8 hover:bg-neutral-100">
                        <td>{{ usuario.nombres + ' ' + usuario.apellidos }}</td>
                        <td>{{ usuario.usuario }}</td>
                        <td>{{ usuario.telefono }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AreaShowModalComponent {
  @Input() area!: Area;
  @Output() close = new EventEmitter<void>();

  private usuariosService = inject(UsuariosService);

  tableHeaders = [
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
  ];
  usuarios: Usuario[] = [];

  User = faUser;
  Rol = faTags;
}