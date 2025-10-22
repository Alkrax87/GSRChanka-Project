import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Area } from '../../interfaces/area';
@Component({
  selector: 'app-area-show-modal',
  imports: [],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl w-96 shadow-xl overflow-hidden">
        <div class="relative">
          <h1 class="text-center">DETALLE AREA</h1>
        </div>
        <div class="p-6 bg-white text-center pt-14 px-5 pb-5">
          <p class="text-xl font-semibold">AREA: {{ area.nombrearea }}</p>
          <p class="text-xl font-semibold">ENCARGADO: {{ area.responsable }}</p>
          <p class="text-xl font-semibold">Miembros Area: {{ area.miembros_area }}</p>
          <div class="flex justify-center gap-2 mt-5">
            <button type="button" (click)="close.emit()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AreaShowModalComponent {
  @Input() area!: Area;
  @Output() close = new EventEmitter<void>();
}
