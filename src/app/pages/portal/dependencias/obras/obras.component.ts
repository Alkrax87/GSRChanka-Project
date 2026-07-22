import { Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BreadcrumbComponent } from "../../../../components/breadcrumb/breadcrumb.component";
import { faBuilding, faEdit, faEye, faFileLines, faPlus, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { DependenciasService } from '../../../../services/dependencias.service';
import { Dependencia } from '../../../../interfaces/dependencia';
import { DependenciaModalComponent } from "../../../../components/dependencia-modal/dependencia-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { DependenciaShowModalComponent } from "../../../../components/dependencia-show-modal/dependencia-show-modal.component";
import { TableComponent } from "../../../../components/table/table.component";

@Component({
  selector: 'app-obras',
  imports: [FaIconComponent, BreadcrumbComponent, DependenciaModalComponent, ConfirmacionEliminarModalComponent, DependenciaShowModalComponent, TableComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Obras'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Obras</h1>
        <button (click)="onAdd()" type="button" class="btn-add">
          <fa-icon [icon]="Add"></fa-icon>Nueva Obra
        </button>
      </div>
      <!-- Content -->
      <div class="flex flex-col gap-4">
        <!-- Summary -->
        <div class="grid gap-4 grid-cols-3">
          <!-- Total -->
          <div class="col-span-1 border-0 w-full flex items-center gap-4 card bg-gradient-to-r from-[#EC4886] to-[#BC55A4] p-4">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-rose-600/80 shadow-md">
              <fa-icon [icon]="Building"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-semibold text-white">Total Obras</p>
              <p class="font-bold text-white text-3xl -mt-1">{{ dependencias().length }}</p>
            </div>
          </div>
          <!-- Documents -->
          <div class="col-span-1 border-0 w-full flex items-center gap-4 card bg-gradient-to-r from-[#48C4EF] to-[#6396DB] p-4">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-cyan-400/80 shadow-md">
              <fa-icon [icon]="Document"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-semibold text-white">Total Documentos</p>
              <p class="font-bold text-white text-3xl -mt-1">{{ totalDocuments() }}</p>
            </div>
          </div>
          <!-- Usuarios -->
          <div class="col-span-1 border-0 w-full flex items-center gap-4 card bg-gradient-to-r from-[#FBB933] to-[#F58554] p-4">
            <div class="text-white text-xl flex justify-center items-center rounded-2xl h-12 w-12 min-w-12 bg-orange-400/80 shadow-md">
              <fa-icon [icon]="Users"></fa-icon>
            </div>
            <div>
              <p class="text-xs font-semibold text-white">Total Usuarios</p>
              <p class="font-bold text-white text-3xl -mt-1">{{ totalUsers() }}</p>
            </div>
          </div>
        </div>
        <!-- Table -->
        <div class="card">
          <app-table
            [tableConstructor]="tableHeaders"
            [data]="dependencias()"
            [actions]="tableActions"
            (action)="handleAction($event)"
          ></app-table>
        </div>
      </div>
    </div>

    @if (isDependenciaModalOpen()) {
      <app-dependencia-modal
        [dependencia]="selectedDependencia()"
        [isArea]="false"
        (close)="isDependenciaModalOpen.set(false)"
      ></app-dependencia-modal>
    }
    @if (isDependenciaShowOpen()) {
      <app-dependencia-show-modal
        [dependencia]="selectedDependencia()!"
        (close)="isDependenciaShowOpen.set(false)"
      ></app-dependencia-show-modal>
    }
    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar la obra ' + selectedDependencia()!.nombre + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class ObrasComponent {
  private dependenciasService = inject(DependenciasService);
  dependencias = computed(() => this.dependenciasService.dependencias().filter(dependencia => dependencia.esArea === false));

  // Table
  tableHeaders = [
    { key: 'id', label: 'ID', isId: true },
    { key: 'nombre', label: 'Obra' },
    { key: 'total', label: 'Documentos' },
    { key: 'usuarios', label: 'Usuarios' },
  ];
  tableActions = [
    { action: 'show', icon: faEye, color: 'text-main', title: 'Ver'},
    { action: 'edit', icon: faEdit, color: 'text-yellow-400', title: 'Editar'},
    { action: 'delete', icon: faTrash, color: 'text-red-600', title: 'Eliminar'},
  ];

  // Modals
  isDependenciaModalOpen = signal(false);
  isDependenciaShowOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedDependencia = signal<Dependencia | null>(null);

  // Icons
  Building = faBuilding;
  Document = faFileLines;
  Users = faUsers;
  Add = faPlus;

  handleAction({action, item}: { action: string; item: any }) {
    switch (action) {
      case 'show':
        this.onShow(item);
        break;
      case 'edit':
        this.onEdit(item);
        break;
      case 'delete':
        this.onDelete(item);
        break;
    }
  }

  totalDocuments() {
    return this.dependencias().reduce((total, dependencia) => total + dependencia.total, 0)
  }

  totalUsers() {
    return this.dependencias().reduce((total, dependencia) => total + dependencia.usuarios, 0)
  }

  onAdd() {
    this.selectedDependencia.set(null);
    this.isDependenciaModalOpen.set(true);
  }

  onShow(dependencia: Dependencia) {
    this.selectedDependencia.set(dependencia);
    this.isDependenciaShowOpen.set(true);
  }

  onEdit(dependencia: Dependencia) {
    this.selectedDependencia.set(dependencia);
    this.isDependenciaModalOpen.set(true);
  }

  onDelete(dependencia: Dependencia) {
    this.selectedDependencia.set(dependencia);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedDependencia()?.id) {
      this.dependenciasService.deleteDependencia(this.selectedDependencia()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}