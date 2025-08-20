import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-confirmacion-eliminar-modal',
  imports: [FaIconComponent],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-80 shadow-lg">
        <h2 class="text-lg font-semibold">{{ message }}</h2>
        <p class="text-sm text-neutral-500">
          Ten en cuenta que esta acción no puede revertirse.
        </p>
        <div class="flex justify-end gap-2 mt-3">
          <button type="button" (click)="cancel.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
          <button type="button" (click)="confirm.emit()" class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full">
            <fa-icon [icon]="Delete"></fa-icon>&nbsp; Eliminar
          </button>
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
