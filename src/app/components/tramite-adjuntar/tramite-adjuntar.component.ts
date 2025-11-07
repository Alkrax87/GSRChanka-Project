import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tramite } from '../../interfaces/tramite';

@Component({
  selector: 'app-tramite-adjuntar',
  imports: [],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">Adjuntar</h2>
        <form>
          <div class="flex flex-col gap-4 my-4">

          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteAdjuntarComponent {
  @Input() tramite!: Tramite | null;
  @Output() close = new EventEmitter<void>();
}
