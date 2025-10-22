import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AreaService } from '../../../services/area.service';
import { TableComponent } from "../../../components/table/table.component";
import { AreaModalComponent } from "../../../components/area-modal/area-modal.component";
import { AreaShowModalComponent } from "../../../components/area-show-modal/area-show-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { Area } from '../../../interfaces/area';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [TableComponent, AreaModalComponent, FontAwesomeModule, ConfirmacionEliminarModalComponent, AreaShowModalComponent],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <p class="text-neutral-400 text-xs font-semibold">
        <span class="text-main">Area</span>
      </p>
      <div class="flex items-center -mt-5 justify-between">
        <h1 class="text-main text-4xl font-bold">ÁREA</h1>
        <button (click)="openCreate()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar Área
        </button>
      </div>
      <app-table [tableConstructor]="headers"
        [data]="areas()"
        (onEdit)="openEdit($event)"
        (onDelete)="openDelete($event)"
        (onShow)="openShow($event)"
      ></app-table>
    </div>

   @if (isAreaModalOpen()) {
      <app-area-modal
        [area]="selectedArea()"
        (close)="isAreaModalOpen.set(false)"
      ></app-area-modal>
    }
    @if (isAreaShowOpen()) {
      <app-area-show-modal
        [area]="selectedArea()!"
        (close)="isAreaShowOpen.set(false)"
      ></app-area-show-modal>
    }
     @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar el área ' + selectedArea()!.nombrearea + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }

  `,
  styles: ``,
})
export class AreasComponent {
  private areasService = inject(AreaService);

  headers = [
    { key: 'nombrearea', label: 'Área Institucional' },
    { key: 'responsable', label: 'Encargado' },
    { key: 'miembros_area', label: 'Miembros Area' }
  ];

  // Signals
  areas = signal<Area[]>([]);
  isAreaModalOpen = signal(false);
  isAreaShowOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedArea = signal<Area | null>(null);

  // Icons
  Add = faPlus;

  ngOnInit() {
    this.areasService.getAreas().subscribe({
      next: (data) => this.areas.set(data),
    });
  }

  openCreate() {
    this.selectedArea.set(null);
    this.isAreaModalOpen.set(true);
  }

  openShow(area: Area) {
    this.selectedArea.set(area);
    this.isAreaShowOpen.set(true);
  }

  openEdit(area: Area) {
    this.selectedArea.set(area);
    this.isAreaModalOpen.set(true);
  }

  openDelete(area: Area) {
    this.selectedArea.set(area);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedArea()?.id) {
      this.areasService.deleteArea(this.selectedArea()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}