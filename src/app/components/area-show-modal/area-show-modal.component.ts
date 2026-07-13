import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faFileLines, faTag, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Area } from '../../interfaces/area';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-area-show-modal',
  imports: [FaIconComponent],
  template: `
    <div class="modal">
      <div class="card w-full max-w-screen-sm">
        <div>
          <h2 class="card-title">{{ area.nombre }}</h2>
          <p class="text-neutral-400 text-xs">ID: {{ area.id }}</p>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="bg-main/10 p-4 rounded-xl">
            <div class="flex gap-1 font-semibold text-sm">
              <fa-icon [icon]="Users" class="text-main"></fa-icon> Usuarios
            </div>
            <p class="text-neutral-800 font-bold text-4xl">{{ area.usuarios }}</p>
          </div>
          <div class="bg-main/10 p-4 rounded-xl">
            <div class="flex gap-1 font-semibold text-sm">
              <fa-icon [icon]="Document" class="text-main"></fa-icon> Documentos
            </div>
            <p class="text-neutral-800 font-bold text-4xl">{{ area.documentos.total }}</p>
          </div>
          <div class="bg-main/10 p-4 rounded-xl">
            <div class="flex gap-1 font-semibold text-sm">
              <fa-icon [icon]="Counter" class="text-main"></fa-icon> Contador
            </div>
            <p class="text-neutral-800 font-bold text-4xl">{{ area.documentos.contador }}</p>
          </div>
        </div>
        <div class="flex justify-end">
          <button type="button" (click)="close.emit()" class="bg-main hover:bg-main/80 px-4 py-2 text-white rounded-full">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AreaShowModalComponent {
  @Input() area!: Area;
  @Output() close = new EventEmitter<void>();

  Users = faUsers;
  Document = faFileLines;
  Counter = faTag;
}