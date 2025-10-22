import { Component, computed, inject, signal } from '@angular/core';
import { TableComponent } from "../../../components/table/table.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AreaService} from '../../../services/area.service';
import { CommonModule } from '@angular/common';
import { AreaModalComponent } from "../../../components/area-modal/area-modal.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Area } from '../../../interfaces/area';
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { AreaShowModalComponent } from "../../../components/area-show-modal/area-show-modal.component";

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule, ReactiveFormsModule, AreaModalComponent, FontAwesomeModule, ConfirmacionEliminarModalComponent, AreaShowModalComponent],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <!-- Tu tabla reutilizable -->
      <div class="flex items-center -mt-5 justify-between">
        <h1 class="text-main text-4xl font-bold">AREA</h1>
        <button (click)="openCreate()" class="bg-main px-4 py-2 text-white rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar Area
        </button>
      </div>
      <app-table [tableConstructor]="headers" 
      [data]="areas()"
      (onEdit)="openEdit($event)"
      (onDelete)="openDelete($event)"
      (onShow)="openShow($event)"
      > 
      </app-table>

    </div>
  
   @if (isAreaModalOpen()) {
      <app-area-modal
        [area]="selectedAreas()"
        (close)="isAreaModalOpen.set(false)"
      ></app-area-modal>
    }
    @if (isAreaShowOpen()) {
    <app-area-show-modal
      [area]="selectedAreas()!"
      (close)="isAreaShowOpen.set(false)"
    ></app-area-show-modal>
    }
     @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar el area ' + selectedAreas()!.nombrearea + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }

  `,
  styles: ``,
})
export class AreasComponent {
   // 🧩 Columnas de la tabla
  headers = [
 
  { key: 'nombrearea', label: 'Área Institucional' },
  { key: 'responsable', label: 'Encargado' },
  { key: 'miembros_area', label: 'Miembros Area' }
];

  // ✅ Signals
  areas = signal<Area[]>([]);
  filteredAreas = signal<Area[]>([]);

  isAreaModalOpen = signal(false);
  isAreaShowOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedAreas = signal<Area | null>(null);

  // ✅ Icono
  Add = faPlus;

  // ✅ Servicio inyectado correctamente (solo una vez)
  private areasService = inject(AreaService);

  ngOnInit() {
    this.areasService.getAreas().subscribe({
      next: (data) => {
        console.log('Datos de Firestore:', data);
        this.areas.set(data);
        this.filteredAreas.set(data);
      },
      error: (err) => console.error('❌ Error al cargar áreas:', err)
    });
  }

  // 🧠 Métodos
  openCreate() {
    this.selectedAreas.set(null);
    this.isAreaModalOpen.set(true);
  }
  openShow(area: Area) {
    this.selectedAreas.set(area);
    this.isAreaShowOpen.set(true);
  }

  openEdit(area: Area) {
    this.selectedAreas.set(area);
    this.isAreaModalOpen.set(true);
  }

  openDelete(area: Area) {
    this.selectedAreas.set(area);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedAreas()?.id) {
      this.areasService.deleteArea(this.selectedAreas()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}
 


  
