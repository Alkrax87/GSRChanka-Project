import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faEye, faMagnifyingGlass, faPenToSquare, faPlus, faTags, faTrash, faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { AreaService } from '../../../services/area.service';
import { AreaModalComponent } from "../../../components/area-modal/area-modal.component";
import { AreaShowModalComponent } from "../../../components/area-show-modal/area-show-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { Area } from '../../../interfaces/area';
import { UsuariosService } from '../../../services/usuarios.service';
import { combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Usuario } from '../../../interfaces/usuario';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [AreaModalComponent, FontAwesomeModule, ConfirmacionEliminarModalComponent, AreaShowModalComponent, ReactiveFormsModule],
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
      <!-- Search -->
      <div class="relative w-full md:w-1/2 lg:w-1/3">
        <fa-icon [icon]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></fa-icon>
        <input
          [formControl]="searchControl"
          type="text"
          placeholder="Buscar area..."
          class="w-full rounded-full shadow-md pl-10 pr-4 py-2 outline-none ring-[3px] ring-transparent focus:ring-main/50 focus:text-main"
        >
      </div>
      <!-- Areas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl::grid-cols-4 gap-6">
        @for (area of filteredAreas(); track $index) {
          <div class="bg-white group rounded-2xl p-6 shadow-md flex flex-col gap-4 relative top-0 hover:-top-1 duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 truncate">
                <div class="bg-main w-4 h-4 rounded-full"></div>
                <div class="truncate">
                  <div class="font-semibold text-xl text-neutral-900">{{ area.nombre }}</div>
                  <div class="text-sm text-neutral-600 truncate">{{ area.responsable }}</div>
                </div>
              </div>
              <div class="text-neutral-600 flex flex-col gap-1 opacity-0 group-hover:opacity-100 duration-300">
                <button (click)="openShow(area)" class="hover:bg-main/10 hover:text-main px-2 py-1 text-sm rounded-full duration-300">
                  <fa-icon [icon]="Show"></fa-icon>
                </button>
                <button (click)="openEdit(area)" class="hover:bg-yellow-100 hover:text-yellow-500 px-2 py-1 text-sm rounded-full duration-300">
                  <fa-icon [icon]="Edit"></fa-icon>
                </button>
                <button (click)="openDelete(area)" class="hover:bg-red-100 hover:text-red-600 px-2 py-1 text-sm rounded-full duration-300">
                  <fa-icon [icon]="Delete"></fa-icon>
                </button>
              </div>
            </div>
            <div class="bg-neutral-100 flex items-center gap-3 p-3 rounded-xl">
              <div class="text-main p-2 rounded-lg bg-main/10">
                <fa-icon [icon]="Rol"></fa-icon>
              </div>
              <div>
                <p class="text-lg font-semibold text-neutral-900">{{ area.rolAsociado }}</p>
                <p class="text-xs text-neutral-500">Rol Asociado</p>
              </div>
            </div>
          </div>
        }
      </div>
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
  private usuariosService = inject(UsuariosService);
  private rolesService = inject(RolesService);
  areas = signal<Area[]>([]);
  usuarios = signal<Usuario[]>([]);
  filteredAreas = signal<Area[]>([]);

  searchControl = new FormControl('');

  // Signals
  isAreaModalOpen = signal(false);
  isAreaShowOpen = signal(false);
  isAreaUsersManagerOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedArea = signal<Area | null>(null);

  // Icons
  Add = faPlus;
  Search = faMagnifyingGlass;
  Show = faEye;
  Edit = faPenToSquare;
  Delete = faTrash;
  Rol = faTags;

  constructor() {
    combineLatest([
      this.areasService.getAreas(),
      this.usuariosService.getUsers(),
      this.rolesService.getRoles(),
    ]).pipe(takeUntilDestroyed()).subscribe({
      next: ([areas, usuarios, roles]) => {
        this.areas.set(
          areas.map((area) => {
            const usuario = usuarios.find((usuario) => usuario.id === area.responsable);
            const rol = roles.find((rol) => rol.id === area.rolAsociado);

            return {
              ...area,
             responsable: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sin responsable',
             rolAsociado: rol ? rol.nombre : 'No hay rol asociado',
            };
          })
        );
        this.filteredAreas.set(
          areas.map((area) => {
            const usuario = usuarios.find((usuario) => usuario.id === area.responsable);
            const rol = roles.find((rol) => rol.id === area.rolAsociado);

            return {
              ...area,
             responsable: usuario ? `${usuario.nombres} ${usuario.apellidos}` : 'Sin responsable',
             rolAsociado: rol ? rol.nombre : 'No hay rol asociado',
            };
          })
        );
        this.usuarios.set(usuarios);
      },
    });
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => value?.toLowerCase() ?? '')
    ).subscribe(term => {
      const result = this.areas().filter(a => a.nombre.toLocaleLowerCase().includes(term));
      this.filteredAreas.set(result);
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