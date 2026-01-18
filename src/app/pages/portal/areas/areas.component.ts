import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faEye, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AreaService } from '../../../services/area.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { AreaModalComponent } from '../../../components/area-modal/area-modal.component';
import { AreaShowModalComponent } from '../../../components/area-show-modal/area-show-modal.component';
import { ConfirmacionEliminarModalComponent } from '../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component';
import { Area } from '../../../interfaces/area';

@Component({
  selector: 'app-areas',
  imports: [FontAwesomeModule, BreadcrumbComponent, AreaModalComponent, AreaShowModalComponent, ConfirmacionEliminarModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-10 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Áreas'"></app-breadcrumb>
      <div class="flex items-center -mt-3 justify-between">
        <h1 class="text-main text-4xl font-bold">ÁREAS</h1>
        <button (click)="onAdd()" type="button" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 rounded-full">
          <fa-icon [icon]="Add"></fa-icon> Agregar
        </button>
      </div>
      <!-- Counter -->
      <div class="text-neutral-400 text-sm">Mostrando {{ areas().length }} registros</div>
      <!-- Areas -->
      @if (areas().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (area of areas(); track $index) {
            <div class="bg-white group rounded-3xl p-6 shadow-md relative top-0 hover:-top-1 duration-300">
              <div class="flex justify-between">
                <div class="flex items-center gap-2 truncate">
                  <div class="bg-main w-4 h-4 rounded-full"></div>
                  <div class="font-semibold text-lg text-neutral-900 truncate">{{ area.nombre }}</div>
                </div>
                <div class="text-neutral-600 flex gap-4 opacity-0 group-hover:opacity-100 duration-300">
                  <button (click)="onShow(area)" class="hover:text-main text-sm duration-300"><fa-icon [icon]="Show"></fa-icon></button>
                  <button (click)="onEdit(area)" class="hover:text-amber-400 text-sm duration-300"><fa-icon [icon]="Edit"></fa-icon></button>
                  <button (click)="onDelete(area)" class="hover:text-red-600 text-sm duration-300"><fa-icon [icon]="Delete"></fa-icon></button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-neutral-400 text-center py-10">
          <fa-icon [icon]="Building" class="text-3xl"></fa-icon>
          <p>No hay áreas</p>
        </div>
      }
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
        [message]="'¿Eliminar el área ' + selectedArea()!.nombre + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class AreasComponent {
  private areasService = inject(AreaService);
  areas = this.areasService.areas;

  // Modals
  isAreaModalOpen = signal(false);
  isAreaShowOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedArea = signal<Area | null>(null);

  // Icons
  Building = faBuilding;
  Add = faPlus;
  Show = faEye;
  Edit = faPenToSquare;
  Delete = faTrash;

  onAdd() {
    this.selectedArea.set(null);
    this.isAreaModalOpen.set(true);
  }

  onShow(area: Area) {
    this.selectedArea.set(area);
    this.isAreaShowOpen.set(true);
  }

  onEdit(area: Area) {
    this.selectedArea.set(area);
    this.isAreaModalOpen.set(true);
  }

  onDelete(area: Area) {
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