import { Component, computed, inject, signal } from '@angular/core';
import { RolesService } from '../../../../services/roles.service';
import { Rol } from '../../../../interfaces/rol';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faPenToSquare, faPlus, faTags, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { RolModalComponent } from "../../../../components/rol-modal/rol-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';

@Component({
  selector: 'app-roles',
  imports: [FontAwesomeModule, RolModalComponent, ConfirmacionEliminarModalComponent, ɵInternalFormsSharedModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <p class="text-neutral-400 text-xs font-semibold">
        <span class="text-main">Usuarios</span> &nbsp;&nbsp;/&nbsp;&nbsp; Roles
      </p>
      <div class="flex items-center -mt-5 justify-between">
        <h1 class="text-main text-4xl font-bold">ROLES</h1>
        <button (click)="openCreate()" class="bg-main px-4 py-2 text-white rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar Rol
        </button>
      </div>
      <!-- Cards -->
      <div class="grid grid-cols-2 gap-5">
        <!-- 1 -->
        <div class="grid-cols-1 bg-gradient-to-br from-main/20 to-slate-50 p-6 rounded-xl">
          <div class="flex items-center gap-3 p-3 rounded-xl">
            <div class="text-main text-2xl p-3 rounded-lg bg-main/10">
              <fa-icon [icon]="Rol"></fa-icon>
            </div>
            <div>
              <p class="text-2xl font-semibold text-neutral-900">{{ roles().length }}</p>
              <p class="text-sm text-neutral-500">Roles</p>
            </div>
          </div>
        </div>
        <!-- 2 -->
        <div class="grid-cols-1 bg-gradient-to-br from-emerald-500/15 to-slate-50 p-6 rounded-xl">
          <div class="flex items-center gap-3 p-3 rounded-xl">
            <div class="text-emerald-500 text-2xl p-3 rounded-lg bg-main/10">
              <fa-icon [icon]="Users"></fa-icon>
            </div>
            <div>
              <p class="text-2xl font-semibold text-neutral-900">{{ totalUsuarios() }}</p>
              <p class="text-sm text-neutral-500">Usuarios Asignados</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Search -->
      <div class="relative w-full md:w-1/2 lg:w-1/3">
        <fa-icon [icon]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></fa-icon>
        <input
          [formControl]="searchControl"
          type="text"
          placeholder="Buscar roles..."
          class="w-full rounded-full shadow-md pl-10 pr-4 py-2 outline-none ring-[3px] ring-transparent focus:ring-main/50 focus:text-main"
        >
      </div>
      <!-- Roles -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl::grid-cols-4 gap-6">
        @for (rol of filteredRoles(); track $index) {
          <div class="bg-white group grid-cols-1 rounded-2xl p-6 shadow-md flex flex-col gap-6 relative top-0 hover:-top-1 duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 truncate">
                <div class="bg-main w-4 h-4 rounded-full"></div>
                <div class="truncate">
                  <div class="font-semibold text-xl text-neutral-900">{{ rol.nombre }}</div>
                  <div class="text-sm text-neutral-600 truncate">{{ rol.descripcion }}</div>
                </div>
              </div>
              <div class="text-neutral-600 flex flex-col gap-1 opacity-0 group-hover:opacity-100 duration-300">
                <button (click)="openEdit(rol)" class="hover:bg-main/10 hover:text-main px-2 py-1 text-sm rounded-full duration-300">
                  <fa-icon [icon]="Edit"></fa-icon>
                </button>
                <button (click)="openDelete(rol)" class="hover:bg-red-100 hover:text-red-600 px-2 py-1 text-sm rounded-full duration-300">
                  <fa-icon [icon]="Delete"></fa-icon>
                </button>
              </div>
            </div>
            <div class="bg-neutral-100 flex items-center gap-3 p-3 rounded-xl">
              <div class="text-main p-2 rounded-lg bg-main/10">
                <fa-icon [icon]="Users"></fa-icon>
              </div>
              <div>
                <p class="text-lg font-semibold text-neutral-900">{{ rol.usuarios }}</p>
                <p class="text-xs text-neutral-500">Usuarios</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    @if (isRoleModalOpen()) {
      <app-rol-modal
        [rol]="selectedRole()"
        (close)="isRoleModalOpen.set(false)"
      ></app-rol-modal>
    }

    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar rol de ' + selectedRole()?.nombre + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class RolesComponent {
  private rolesService = inject(RolesService);
  roles = signal<Rol[]>([]);
  filteredRoles = signal<Rol[]>([]);

  searchControl = new FormControl('');

  // Signals
  isRoleModalOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedRole = signal<Rol | null>(null);

  // Icons
  Add = faPlus;
  Rol = faTags;
  Users = faUsers;
  Search = faMagnifyingGlass;
  Edit = faPenToSquare;
  Delete = faTrash;

  ngOnInit() {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles.set(data);
        this.filteredRoles.set(data);
      },
    });

    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => value?.toLowerCase() ?? '')
    ).subscribe(term => {
      const result = this.roles().filter(r => r.nombre.toLowerCase().includes(term));
      this.filteredRoles.set(result);
    });
  }

  totalUsuarios = computed(() =>
    this.roles().reduce((acc, rol) => acc + (rol.usuarios || 0), 0)
  )

  openCreate() {
    this.selectedRole.set(null);
    this.isRoleModalOpen.set(true);
  }

  openEdit(rol: Rol) {
    this.selectedRole.set(rol);
    this.isRoleModalOpen.set(true);
  }

  openDelete(rol: Rol) {
    this.selectedRole.set(rol);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedRole()?.id) {
      this.rolesService.deleteRol(this.selectedRole()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}
