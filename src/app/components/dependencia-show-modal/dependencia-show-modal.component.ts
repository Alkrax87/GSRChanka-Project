import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Dependencia } from '../../interfaces/dependencia';
import { faFileLines, faTag, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dependencia-show-modal',
  imports: [FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">{{ dependencia.nombre }}</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="w-full bg-main/10 rounded-2xl p-2">
            <div class="flex gap-1 text-main text-xs font-semibold items-center justify-center">
              <fa-icon [icon]="Users" class="text-main"></fa-icon> Usuarios
            </div>
            <p class="font-bold text-4xl text-neutral-700 text-center">{{ dependencia.usuarios }}</p>
          </div>
          <div class="w-full bg-main/10 rounded-2xl p-2">
            <div class="flex gap-1 text-main text-xs font-semibold items-center justify-center">
              <fa-icon [icon]="Document" class="text-main"></fa-icon> Documentos
            </div>
            <p class="font-bold text-4xl text-neutral-700 text-center">{{ dependencia.total }}</p>
          </div>
        </div>
        <div class="flex justify-center gap-2">
          <button type="button" (click)="close.emit()" class="btn-main">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class DependenciaShowModalComponent {
  @Input() dependencia!: Dependencia;
  @Output() close = new EventEmitter<void>();

  Users = faUsers;
  Document = faFileLines;
  Counter = faTag;
  X = faTimes;
}