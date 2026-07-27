import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirmacion-eliminar-modal',
  imports: [FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <h2 class="card-title">{{ message }}</h2>
        <p class="text-sm text-neutral-500">Ten en cuenta que esta acción no puede revertirse.</p>
        <div class="flex justify-end gap-2">
          <button type="button" (click)="cancel.emit()" class="btn-cancel">Cancelar</button>
          <button type="button" (click)="confirm.emit()" class="btn-delete"><fa-icon [icon]="Delete"></fa-icon>Eliminar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ConfirmacionEliminarModalComponent {
  @Input() message = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  Delete = faTrash;
}