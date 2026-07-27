import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, faBuilding, faCheck, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faFileLines, faGear, faHammer, faHourglassHalf, faMinus, faSearch, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from '@angular/fire/firestore';
import { UsuariosService } from '../../services/usuarios.service';
import { DependenciasService } from '../../services/dependencias.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-table',
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <!-- Seach and Selector -->
    <div class="flex justify-between">
      <!-- Search -->
      <div class="relative w-full md:w-1/2 lg:w-1/3 group">
        <fa-icon [icon]="Search" class="absolute left-3 top-1/2 group-hover:text-main/50 -translate-y-1/2 text-neutral-400"></fa-icon>
        <input
          type="text"
          placeholder="Buscar..."
          [value]="searchTerm"
          (input)="onSearch($event)"
          class="group-hover:border-main/50 border-2 w-full rounded-2xl pl-10 pr-4 py-2 outline-none focus:border-main/50 focus:text-main"
        >
      </div>
      <!-- Items -->
      <div class="flex items-center gap-2">
        <p class="text-neutral-400 text-sm">Elementos por página:</p>
        <select
          [value]="pageSize"
          (change)="onPageSizeChange($event)"
          class="bg-white hover:border-main/50 focus:border-main/50 border-2 text-main text-end text-sm px-3 py-1 rounded-2xl cursor-pointer outline-none"
        >
          <option class="text-start" value="20">20</option>
          <option class="text-start" value="50">50</option>
          <option class="text-start" value="100">100</option>
          <option class="text-start" value="200">200</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="my-6 overflow-auto">
      <table class="w-full">
        <thead class="">
          <tr class="bg-main text-white h-8 text-sm">
            <th class="max-w-8 w-8 rounded-l-lg"></th>
            @for (header of tableConstructor; track $index) {
              <th (click)="sortData(header.key)" class="cursor-pointer text-start" [ngClass]="{ 'pr-2': $index === 0, 'pl-2': $index === tableConstructor.length - 1, 'p-2': $index != 0 && $index < tableConstructor.length - 1 }">
                {{ header.label }}
                @if (sortColumn === header.key) {
                  @if (sortDirection === 'asc') {
                    <fa-icon class="text-sm m-0.5" [icon]="Ascendent"></fa-icon>
                  } @else {
                    <fa-icon class="text-sm m-0.5" [icon]="Descendent"></fa-icon>
                  }
                }
              </th>
            }
            <th class="rounded-r-lg">Opciones</th>
          </tr>
        </thead>
        <tbody>
          @for (row of paginatedData; track $index) {
            <tr class="h-10 text-sm group">
              <td class="font-bold text-neutral-500 text-xxs max-w-10 text-center group-hover:bg-main/10 rounded-l-lg">{{ $index + 1 }}.</td>
              @for (header of tableConstructor; track $index) {
                <td class="group-hover:bg-main/10" [ngClass]="{ 'pr-2': $index === 0, 'pl-2': $index === tableConstructor.length - 1, 'p-2': $index != 0 && $index < tableConstructor.length - 1 }">
                  @if (header.status) {
                    @switch (getNestedValue(row, header.key)) {
                      @case ('Pendiente') {
                        <span class="bg-[#FFC108] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="Hourglass"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                      @case ('En Proceso') {
                        <span class="bg-[#17A2B9] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="Gear"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                      @case ('Completado') {
                        <span class="bg-[#28A745] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="Check"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                      @case ('Cancelado') {
                        <span class="bg-[#DC3646] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="Xmark"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                    }
                  } @else if (header.priority) {
                    @switch (getNestedValue(row, header.key)) {
                      @case ('Sin Determinar') {
                        <span class="bg-[#E2E2E3] text-neutral-500 text-center font-bold text-sm rounded-full px-5 pb-0.5">-</span>
                      }
                      @case ('Baja') {
                        <span class="bg-[#21a300] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="Low"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                      @case ('Media') {
                        <span class="bg-[#0071c2] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="Medium"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                      @case ('Alta') {
                        <span class="bg-[#eb0004] text-white font-semibold text-sm rounded-full px-3 pb-0.5">
                          <fa-icon [icon]="High"></fa-icon>&nbsp; {{ getNestedValue(row, header.key) }}
                        </span>
                      }
                    }
                  } @else if (header.isDate) {
                    <span class="font-semibold text-xs text-neutral-400">
                      {{ getDateTransformed(getNestedValue(row, header.key)) }}
                    </span>
                  } @else if (header.isId) {
                    <span class="font-semibold text-xs text-neutral-400">
                      {{ getNestedValue(row, header.key) }}
                    </span>
                  } @else if (header.isDependencia) {
                    <span class="badge bg-main/75 truncate text-white">
                      {{ getDependenciaName(getNestedValue(row, header.key)) }}
                    </span>
                  } @else if (header.isUsuario) {
                    {{ getUsuarioName(getNestedValue(row, header.key)) }}
                  } @else if (header.isFormat) {
                    @switch (getNestedValue(row, header.key).split('/')[1]) {
                      @case ('pdf') {
                        <span class="bg-[#E30809] text-white font-semibold text-sm rounded-full px-3 pb-0.5">PDF</span>
                      }
                      @case ('msword') {
                        <span class="bg-[#205FC0] text-white font-semibold text-sm rounded-full px-3 pb-0.5">Word</span>
                      }
                      @case ('vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        <span class="bg-[#205FC0] text-white font-semibold text-sm rounded-full px-3 pb-0.5">Word</span>
                      }
                      @case ('vnd.ms-excel') {
                        <span class="bg-[#097640] text-white font-semibold text-sm rounded-full px-3 pb-0.5">Excel</span>
                      }
                      @case ('vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        <span class="bg-[#097640] text-white font-semibold text-sm rounded-full px-3 pb-0.5">Excel</span>
                      }
                      @case ('vnd.ms-powerpoint') {
                        <span class="bg-[#F14B28] text-white font-semibold text-sm rounded-full px-3 pb-0.5">PowerPoint</span>
                      }
                      @case ('vnd.openxmlformats-officedocument.presentationml.presentation') {
                        <span class="bg-[#F14B28] text-white font-semibold text-sm rounded-full px-3 pb-0.5">PowerPoint</span>
                      }
                    }
                  } @else if (header.isSize) {
                    <span class="bg-neutral-200 truncate rounded-full text-sm px-3 pb-0.5">
                      <fa-icon class="text-neutral-600" [icon]="Document"></fa-icon>&nbsp; {{ (getNestedValue(row, header.key) / 1024 / 1024).toFixed(2) }} MB
                    </span>
                  } @else {
                    {{ getNestedValue(row, header.key) || '-' }}
                  }
                </td>
              }
              <td class="group-hover:bg-main/10 rounded-r-lg">
                <div class="flex items-center justify-center text-base gap-4">
                  @for (btn of actions; track $index) {
                    @if (btn.ownership) {
                      @if (currentUser === getNestedValue(row, 'propietario.ownerId')) {
                        <button (click)="action.emit({ action: btn.action, item: row })" [class]="btn.color" [title]="btn.title">
                          <fa-icon [icon]="btn.icon"></fa-icon>
                        </button>
                      }
                    } @else {
                      <button (click)="action.emit({ action: btn.action, item: row })" [class]="btn.color" [title]="btn.title">
                        <fa-icon [icon]="btn.icon"></fa-icon>
                      </button>
                    }
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Paginate -->
    <div class="flex items-center justify-between gap-2">
      <!-- Paginate -->
      <div class="text-neutral-400 text-xs">
        Mostrando &nbsp; {{ startRecord + 1 }} &nbsp;a&nbsp; {{ endRecord }} &nbsp;de&nbsp; {{ filteredData.length }} &nbsp; registros
      </div>
      <!-- Paginate -->
      <div class="flex gap-2">
        <!-- Previous -->
         <button (click)="prevPage()" [disabled]="currentPage === 1" [ngClass]="{'bg-neutral-200 hover:bg-neutral-200': currentPage === 1}" class="bg-main hover:bg-main-hover w-7 h-7 text-white rounded-full font-semibold text-sm">
          <fa-icon class="text-sm" [icon]="Previous"></fa-icon>
        </button>
        <!-- Pages -->
        <div class="flex gap-0.5">
          @for (page of [].constructor(totalPages); track $index) {
            <button (click)="goToPage($index + 1)" [ngClass]="{'bg-main text-white': currentPage === ($index + 1)}" class="w-7 h-7 rounded-full outline-none hover:bg-main hover:text-white duration-300">
              {{ $index + 1 }}
            </button>
          }
        </div>
        <!-- Next -->
        <button (click)="nextPage()" [disabled]="currentPage === totalPages" [ngClass]="{'bg-neutral-200 hover:bg-neutral-200': currentPage === totalPages}" class="bg-main hover:bg-main-hover w-7 h-7 text-white rounded-full font-semibold text-sm">
          <fa-icon class="text-sm" [icon]="Next"></fa-icon>
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class TableComponent {
  @Input() tableConstructor: {
    key: string,
    label: string,
    status?: boolean,
    priority?: boolean,
    isId?: boolean,
    isDate?: boolean,
    isUsuario?: boolean,
    isDependencia?: boolean,
    isSize?: boolean,
    isFormat?: boolean
  }[] = [];
  @Input() data: any[] = [];
  @Input() actions: { action: string; icon: IconDefinition; color: string; title: string, ownership?: boolean }[] = [];
  @Output() action = new EventEmitter<{ action: string; item: any }>();

  dependencias = inject(DependenciasService).dependencias;
  usuarios = inject(UsuariosService).usuarios;
  currentUser = inject(AuthService).usuarioLogged()!.id;

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  Ascendent = faChevronUp;
  Descendent = faChevronDown;
  Previous = faChevronLeft;
  Next = faChevronRight;
  Search = faSearch;

  // Dependencia
  Area = faBuilding;
  Obra = faHammer;

  // Priority
  High = faAngleUp;
  Medium = faMinus;
  Low = faAngleDown;

  // Status
  Hourglass = faHourglassHalf;
  Gear = faGear;
  Check = faCheck;
  Xmark = faXmark;

  // Size
  Document = faFileLines;

  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  startRecord = 0;
  endRecord = 0;

  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['tableConstructor']) {
      this.applyFilters();
    }
  }

  getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((acc, part) => {
      if (!acc) return undefined;

      const arrayRegex = /^([a-zA-Z0-9_]+)\[(\d+)\]$/;

      if (arrayRegex.test(part)) {
        const [, arrayKey, indexStr] = part.match(arrayRegex)!;
        const index = parseInt(indexStr, 10);

        return acc[arrayKey]?.[index];
      }

      return acc[part];
    }, obj);
  }

  getDateTransformed(date: Timestamp) {
    const now = formatDate(date.toDate(), 'EEE dd MMM, HH:mm', 'es');
    return now.replace(/\b\w/g, l => l.toUpperCase());;
  }

  getDependenciaName(dependenciaId: string) {
    const dependencia = this.dependencias().find(d => d.id === dependenciaId);
    return dependencia ? dependencia.nombre : '';
  }

  getUsuarioName(usuarioId: string) {
    const usuario = this.usuarios().find(u => u.id === usuarioId);
    return usuario ? usuario.nombres + ' ' + usuario.apellidos : '';
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    // Filtrado por búsqueda
    this.filteredData = this.data.filter(row =>
      this.tableConstructor.some(col =>
        this.getNestedValue(row, col.key)?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    // Total de páginas
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;

    // Reset de página si se pasa
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.updatePagination();
  }

  sortData(header: string) {
    if (this.sortColumn === header) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = header;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const valA = this.getNestedValue(a, header)?.toString().toLowerCase() ?? '';
      const valB = this.getNestedValue(b, header)?.toString().toLowerCase() ?? '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
    this.startRecord = start;
    this.endRecord = Math.min(end, this.filteredData.length);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }
}