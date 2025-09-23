import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faEdit, faEye, faSearch, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  standalone: true,
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
            @for (header of headers; track $index) {
              <th (click)="sortData(header)" class="cursor-pointer text-start px-3">
                {{ header }}
                @if (sortColumn === header) {
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
              @for (header of headers; track $index) {
                <td class="px-3">{{ row[header] }}</td>
              }
              <td>
                <div class="flex items-center justify-center gap-4">
                  <button (click)="onShow.emit(row)" class="text-main" title="Ver">
                    <fa-icon [icon]="Eye"></fa-icon>
                  </button>
                  <button (click)="onEdit.emit(row)" class="text-yellow-400" title="Editar">
                    <fa-icon [icon]="Edit"></fa-icon>
                  </button>
                  <button (click)="onDelete.emit(row)"  class="text-red-600"title="Eliminar">
                    <fa-icon [icon]="Trash"></fa-icon>
                  </button>
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
          @for (page of [].constructor(totalPages); let i = $index; track $index) {
            <button (click)="goToPage(i + 1)"
              [ngClass]="{'bg-main text-white': currentPage === (i+1)}"
              class="border w-8 h-8 rounded-full hover:bg-main hover:text-white duration-300"
            >
              {{ i + 1 }}
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
export class TableComponent implements OnInit, OnChanges{
  @Input() headers: string[] = [];
  @Input() data: any[] = [];

  @Output() onShow = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  Ascendent = faChevronUp;
  Descendent = faChevronDown;
  Previous = faChevronLeft;
  Next = faChevronRight;
  Search = faSearch;
  Eye = faEye;
  Edit = faEdit;
  Trash = faTrash;

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
    if (changes['data'] || changes['headers']) {
      this.applyFilters();
    }
  }
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1; // Reiniciar a la primera página
    this.applyFilters();
  }

  applyFilters() {
    // Filtrado por búsqueda
    this.filteredData = this.data.filter(row =>
      Object.values(row).some(val =>
        val?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
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
      const valA = a[header];
      const valB = b[header];

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