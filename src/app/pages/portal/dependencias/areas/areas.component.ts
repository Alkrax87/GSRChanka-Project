import { Component, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BreadcrumbComponent } from "../../../../components/breadcrumb/breadcrumb.component";
import { faBuilding, faEye, faFileLines, faPenToSquare, faPlus, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { DependenciasService } from '../../../../services/dependencias.service';
import { Dependencia } from '../../../../interfaces/dependencia';
import { DependenciaModalComponent } from "../../../../components/dependencia-modal/dependencia-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { DependenciaShowModalComponent } from "../../../../components/dependencia-show-modal/dependencia-show-modal.component";

@Component({
  selector: 'app-areas',
  imports: [FaIconComponent, BreadcrumbComponent, DependenciaModalComponent, ConfirmacionEliminarModalComponent, DependenciaShowModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Áreas'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Áreas</h1>
        <button (click)="onAdd()" type="button" class="btn-add">
          <fa-icon [icon]="Add"></fa-icon>Nueva Área
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
              <p class="text-xs font-semibold text-white">Total Áreas</p>
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
        <!-- Areas -->
        <div class="card min-h-[526px] col-span-2 row-span-2">
          @if (dependencias().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (dependencia of dependencias(); track $index) {
                <div class="card-item hover:bg-main/10 hover:border-main/50 group rounded-2xl p-4 relative top-0 hover:-top-1 duration-300">
                  <div class="flex justify-between">
                    <div class="flex items-center gap-2 truncate">
                      <div class="bg-main w-1 h-full rounded-full"></div>
                      <div class="flex flex-col">
                        <div class="font-semibold text-lg text-neutral-700 truncate">{{ dependencia.nombre }}</div>
                        <div class="font-semibold text-xs text-neutral-400 truncate -mt-1">ID: {{ dependencia.id }}</div>
                        <div class="flex gap-2 font-semibold text-neutral-600 text-sm mt-2">
                          <div class="badge bg-main text-white shadow-none">
                            <fa-icon [icon]="Document"></fa-icon> {{ dependencia.total }}
                          </div>
                          <div class="badge bg-main text-white shadow-none">
                            <fa-icon [icon]="Users"></fa-icon> {{ dependencia.usuarios }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="text-neutral-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 duration-300">
                      <button (click)="onShow(dependencia)" class="flex items-center justify-center hover:bg-main min-w-9 w-9 h-9 hover:text-white rounded-full text-sm duration-300" title="Mostrar"><fa-icon [icon]="Show"></fa-icon></button>
                      <button (click)="onEdit(dependencia)" class="flex items-center justify-center hover:bg-yellow-500 min-w-9 w-9 h-9 hover:text-white rounded-full text-sm duration-300" title="Editar"><fa-icon [icon]="Edit"></fa-icon></button>
                      <button (click)="onDelete(dependencia)" class="flex items-center justify-center hover:bg-red-600 min-w-9 w-9 h-9 hover:text-white rounded-full text-sm duration-300" title="Eliminar"><fa-icon [icon]="Delete"></fa-icon></button>
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
        <!-- Counter -->
        <div class="text-neutral-400 text-xs px-4">Mostrando {{ dependencias().length }} registros</div>
      </div>
    </div>

    @if (isDependenciaModalOpen()) {
      <app-dependencia-modal
        [dependencia]="selectedDependencia()"
        [isArea]="true"
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
        [message]="'¿Eliminar el área ' + selectedDependencia()!.nombre + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class AreasComponent {
  private dependenciasService = inject(DependenciasService);
  dependencias = computed(() => this.dependenciasService.dependencias().filter(dependencia => dependencia.esArea === true));

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
  Show = faEye;
  Edit = faPenToSquare;
  Delete = faTrash;

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