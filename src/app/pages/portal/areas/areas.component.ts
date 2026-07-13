import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBuilding, faEye, faFileLines, faPenToSquare, faPlus, faTag, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AreaService } from '../../../services/area.service';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { AreaModalComponent } from '../../../components/area-modal/area-modal.component';
import { AreaShowModalComponent } from '../../../components/area-show-modal/area-show-modal.component';
import { ConfirmacionEliminarModalComponent } from '../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component';
import { Area } from '../../../interfaces/area';

@Component({
  selector: 'app-areas',
  imports: [FaIconComponent, BreadcrumbComponent, AreaModalComponent, AreaShowModalComponent, ConfirmacionEliminarModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-10 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Áreas'"></app-breadcrumb>
      <div class="flex items-center -mt-3 justify-between">
        <h1 class="text-main text-4xl font-bold">ÁREAS</h1>
        <button (click)="onAdd()" type="button" class="bg-green-600 hover:bg-green-600/80 text-white flex items-center gap-2 px-4 py-2 rounded-full">
          <fa-icon [icon]="Add"></fa-icon> Agregar
        </button>
      </div>
      <!-- Content -->
      <div class="w-full grid grid-cols-4 grid-rows-2 items-start gap-4">
        <!-- Left -->
        <div class="bg-white rounded-3xl min-h-[526px] p-4 shadow-sm col-span-3 row-span-2">
          <!-- Areas -->
          @if (areas().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (area of areas(); track $index) {
                <div class="bg-white hover:bg-main/10 border hover:border-main/50 group rounded-2xl p-6 shadow-sm relative top-0 hover:-top-1 duration-300">
                  <div class="flex justify-between">
                    <div class="flex items-center gap-2 truncate">
                      <div class="bg-main w-4 h-4 rounded-full"></div>
                      <div class="font-semibold text-lg text-neutral-900 truncate">{{ area.nombre }}</div>
                    </div>
                    <div class="text-neutral-600 flex gap-1 opacity-0 group-hover:opacity-100 duration-300">
                      <button (click)="onShow(area)" class="hover:bg-main min-w-9 w-9 py-2 hover:text-white rounded-full text-sm duration-300" title="Mostrar"><fa-icon [icon]="Show"></fa-icon></button>
                      <button (click)="onEdit(area)" class="hover:bg-amber-400 min-w-9 w-9 py-2 hover:text-white rounded-full text-sm duration-300" title="Editar"><fa-icon [icon]="Edit"></fa-icon></button>
                      <button (click)="onDelete(area)" class="hover:bg-red-600 min-w-9 w-9 py-2 hover:text-white rounded-full text-sm duration-300" title="Eliminar"><fa-icon [icon]="Delete"></fa-icon></button>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="flex flex-col justify-center h-[492px] text-neutral-400 text-center py-10">
              <fa-icon [icon]="Building" class="text-3xl"></fa-icon>
              <p>No hay áreas</p>
            </div>
          }
        </div>
        <!-- Right -->
        <div class="flex flex-col col-span-1 gap-4 ">
          <!-- Counter -->
          <div class="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-4 h-20">
            <div class="bg-main/10 rounded-2xl text-main text-2xl flex items-center justify-center min-w-12 w-12 h-12">
              <fa-icon [icon]="Building"></fa-icon>
            </div>
            <div>
              <p class="text-neutral-400 text-xs">Total Áreas</p>
              <p class="text-main font-bold text-2xl">{{ areas().length }}</p>
            </div>
          </div>
          <!-- Documents -->
          <div class="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-4">
            <div class="font-bold text-main text-lg">
              <fa-icon [icon]="Document"></fa-icon> Documentos por área
            </div>
            <div class="flex flex-col gap-1 px-2">
              @if (areas().length > 0) {
                @for (area of areas(); track $index) {
                  <div class="flex items-center gap-2 truncate">
                    <div class="bg-main w-2 h-2 rounded-full"></div>
                    <div class="w-full flex justify-between font-semibold text-neutral-600 truncate">
                      <div>{{ area.nombre }}</div>
                      <div class="min-w-10 text-center">{{ area.documentos.total }}</div>
                    </div>
                  </div>
                }
              } @else {
                <div class="text-neutral-400 text-sm text-center">No hay ninguna área.</div>
              }
            </div>
          </div>
        </div>
      </div>
      <!-- Counter -->
      <div class="text-neutral-400 text-sm">Mostrando {{ areas().length }} registros</div>
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
  Users = faUsers;
  Counter = faTag;
  Building = faBuilding;
  Document = faFileLines;
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