import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp, faCheck, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faGear, faHourglassHalf, faMinus, faSearch, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-table',
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <!-- Seach and Selector -->
    <div class="flex justify-between">
      <!-- Search -->
      <div class="relative w-full md:w-1/2 lg:w-1/3">
        <fa-icon [icon]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></fa-icon>
        <input
          type="text"
          placeholder="Buscar..."
          [value]="searchTerm"
          (input)="onSearch($event)"
          class="w-full rounded-full shadow-md pl-10 pr-4 py-2 outline-none ring-[3px] ring-transparent focus:ring-main/50 focus:text-main"
        >
      </div>
      <!-- Items -->
      <div class="flex items-center gap-2">
        <p class="text-neutral-400 text-sm">Elementos por página:</p>
        <select
          [value]="pageSize"
          (change)="onPageSizeChange($event)"
          class="bg-white ring-transparent ring-[3px] hover:ring-main/50 text-main text-end text-sm px-3 py-1 rounded-full outline-none cursor-pointer shadow-md"
        >
          <option class="text-start" value="10">10</option>
          <option class="text-start" value="20">20</option>
          <option class="text-start" value="30">30</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="my-6 overflow-x-auto shadow-md rounded-3xl border b">
      <table class="w-full">
        <thead class="bg-main text-white">
          <tr class="h-12">
            @for (header of tableConstructor; track $index) {
              <th (click)="sortData(header.key)" class="cursor-pointer text-start px-3">
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
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          @for (row of paginatedData; track $index) {
            <tr class="h-10 hover:bg-neutral-100">
              @for (header of tableConstructor; track $index) {
                <td class="px-3">
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
                    {{ getDateTransformed(getNestedValue(row, header.key)) }}
                  } @else {
                    {{ getNestedValue(row, header.key) || '-' }}
                  }
                </td>
              }
              <td>
                <div class="flex items-center justify-center gap-4">
                  @for (btn of actions; track $index) {
                    <button (click)="action.emit({ action: btn.action, item: row })" [class]="btn.color" [title]="btn.title">
                      <fa-icon [icon]="btn.icon"></fa-icon>
                    </button>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Paginate -->
    <div class="flex justify-between gap-2">
      <!-- Paginate -->
      <div class="text-neutral-400 text-sm">
        Mostrando {{ startRecord + 1 }} a {{ endRecord }} de {{ filteredData.length }} registros
      </div>
      <!-- Paginate -->
      <div class="flex gap-2">
        <!-- Previous -->
         <button (click)="prevPage()" [disabled]="currentPage === 1" [ngClass]="{'bg-neutral-200 hover:bg-neutral-200': currentPage === 1}" class="bg-main hover:bg-main-hover w-8 h-8 text-white rounded-full font-semibold text-sm">
          <fa-icon class="text-sm" [icon]="Previous"></fa-icon>
        </button>
        <!-- Pages -->
        <div class="flex gap-0.5">
          @for (page of [].constructor(totalPages); track $index) {
            <button (click)="goToPage($index + 1)" [ngClass]="{'bg-main text-white': currentPage === ($index + 1)}" class="border w-8 h-8 rounded-full outline-none hover:bg-main hover:text-white duration-300">
              {{ $index + 1 }}
            </button>
          }
        </div>
        <!-- Next -->
        <button (click)="nextPage()" [disabled]="currentPage === totalPages" [ngClass]="{'bg-neutral-200 hover:bg-neutral-200': currentPage === totalPages}" class="bg-main hover:bg-main-hover w-8 h-8 text-white rounded-full font-semibold text-sm">
          <fa-icon class="text-sm" [icon]="Next"></fa-icon>
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class TableComponent {
  @Input() tableConstructor: { key: string, label: string, status?: boolean, priority?: boolean, isDate?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() actions: { action: string; icon: IconDefinition; color: string; title: string }[] = [];
  @Output() action = new EventEmitter<{ action: string; item: any }>();

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  Ascendent = faChevronUp;
  Descendent = faChevronDown;
  Previous = faChevronLeft;
  Next = faChevronRight;
  Search = faSearch;

  // Priority
  High = faAngleUp;
  Medium = faMinus;
  Low = faAngleDown;

  // Status
  Hourglass = faHourglassHalf;
  Gear = faGear;
  Check = faCheck;
  Xmark = faXmark;

  currentPage = 1;
  pageSize = 10;
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