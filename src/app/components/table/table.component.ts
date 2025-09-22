import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretLeft, faCaretRight, faEdit, faEye, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <!-- Barra de búsqueda -->
    <div class="btn btn-success mb-4"style="margin-bottom: 10px; text-align: right; width: 100%;">
      Buscar:&nbsp;
      <input 
        type="text" 
        placeholder="Buscar..." 
        [value]="searchTerm"
        (input)="onSearch($event)"
        style="padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; outline: none; width: 200px;"
      />
    </div>

    <!-- Selector de filas por página -->
    <div style="margin-bottom: 10px;">
      <label for="pageSize">Mostrar: </label>
      <select  id="pageSize" [value]="pageSize" (change)="onPageSizeChange($event)" class="border border-gray-500 rounded-md">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        
      </select>
      &nbsp; &nbsp;<label for="pageSize">Registro por Pagina: </label>
    </div>

    <!-- Tabla -->
    <table>
      <thead>
        <tr>
          @for (header of headers; track $index) {
            <th (click)="sortData(header)" style="cursor: pointer;">
              {{ header }}
              <span *ngIf="sortColumn === header">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
          }
          <th style="text-align: center;">Opciones</th>
        </tr>
      </thead>
      <tbody>
        @for (row of paginatedData; track $index) {
          <tr>
            @for (header of headers; track $index) {
              <td>{{ row[header] }}</td>
            }
            <td style="text-align: center;">
              <button (click)="onShow.emit(row)" title="Ver" class="action-btn view">
                <fa-icon [icon]="Eye"></fa-icon>
              </button>
              <button (click)="onEdit.emit(row)" title="Editar" class="action-btn edit">
                <fa-icon [icon]="Edit"></fa-icon>
              </button>
              <button (click)="onDelete.emit(row)" title="Eliminar" class="action-btn delete">
                <fa-icon [icon]="Trash"></fa-icon>
              </button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    <!-- Paginación -->
    <div style="margin-top: 15px; display: flex; gap: 6px; align-items: center;">
  <!-- Botón Anterior -->
  <button class=""
    (click)="prevPage()" 
    [disabled]="currentPage === 1"
    style="padding: 5px 10px; border: 1px solid #ccc; background: white; cursor: pointer;"
  >
    <fa-icon [icon]="Left"></fa-icon> Anterior
  </button>

  <!-- Botones de página -->
  <div style="display: flex; gap: 4px;">
    @for (page of [].constructor(totalPages); let i = $index; track $index) {
      <button
        (click)="goToPage(i + 1)"
        [style.background]="currentPage === (i+1) ? '#007bff' : 'white'"
        [style.color]="currentPage === (i+1) ? 'white' : 'black'"
        style="padding: 5px 10px; border: 1px solid #ccc; cursor: pointer;"
      >
        {{ i + 1 }}
      </button>
    }
  </div>

  <!-- Botón Siguiente -->
    <button 
      (click)="nextPage()" 
      [disabled]="currentPage === totalPages"
      style="padding: 5px 10px; border: 1px solid #ccc; background: white; cursor: pointer;"
    >
      Siguiente <fa-icon [icon]="Rigth"></fa-icon>
    </button>
  </div>
  <!-- Texto tipo DataTables -->
  <div style="font-size: 13px; color: #555;">
    Mostrando {{ startRecord + 1 }} a {{ endRecord }} de {{ filteredData.length }} registros
  </div>

  `,
  styles: [`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background: #f4f4f4;
      text-align: left;
      user-select: none;
    }
    td, th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    tr:hover {
      background: #f9f9f9;
    }
  `]
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

  Rigth = faCaretRight;
  Left = faCaretLeft;
  Eye = faEye;
  Edit = faEdit;
  Trash = faTrash;

  currentPage = 1;
  pageSize = 5;
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