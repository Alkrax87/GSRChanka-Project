import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { formatDate, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBuilding, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faFileLines, faHammer, faSearch, faUser, faUserShield, faUserTie, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Timestamp } from '@angular/fire/firestore';
import { UsuariosService } from '../../services/usuarios.service';
import { DependenciasService } from '../../services/dependencias.service';
import { AuthService } from '../../services/auth.service';
import { DocumentosService } from '../../services/documentos.service';

@Component({
  selector: 'app-table',
  imports: [NgClass, FaIconComponent],
  template: `
    <!-- Search and page size -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Search -->
      <label class="group relative w-full sm:max-w-sm">
        <span class="sr-only">Buscar en la tabla</span>
        <fa-icon [icon]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 transition group-focus-within:text-main"></fa-icon>
        <input
          type="text"
          placeholder="Buscar en los registros..."
          [value]="searchTerm"
          (input)="onSearch($event)"
          class="h-10 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-main focus:ring-2 focus:ring-main/15"
        >
      </label>
      <!-- Items -->
      <label class="flex items-center justify-between gap-3 text-xs font-medium text-neutral-500 sm:justify-start sm:text-sm">
        <span>Filas por página</span>
        <select
          [value]="pageSize"
          (change)="onPageSizeChange($event)"
          aria-label="Filas por página"
          class="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-700 shadow-sm outline-none transition hover:border-neutral-300 focus:border-main focus:ring-2 focus:ring-main/15"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>
    </div>

    <!-- Table -->
    <div class="my-4 overflow-x-auto rounded-xl border border-neutral-100 sm:my-6">
      <table class="w-full min-w-[48rem] border-separate border-spacing-0 text-left">
        <thead>
          <tr class="h-11 bg-main text-xs font-semibold uppercase tracking-wide text-white sm:text-sm">
            <th scope="col" class="w-12 rounded-tl-xl px-3 text-center" aria-label="Número de fila">#</th>
            @for (header of tableConstructor; track $index) {
              <th scope="col" class="px-3 py-2 text-left" [attr.aria-sort]="sortColumn === header.key ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'">
                <button type="button" class="inline-flex items-center gap-1 rounded-md text-left outline-none transition hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white" (click)="sortData(header.key)" [attr.aria-label]="'Ordenar por ' + header.label">
                  {{ header.label }}
                  @if (sortColumn === header.key) {
                    <fa-icon class="text-xs" [icon]="sortDirection === 'asc' ? Ascendent : Descendent"></fa-icon>
                  }
                </button>
              </th>
            }
            <th scope="col" class="rounded-tr-xl px-3 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (row of paginatedData; track getRowKey(row, $index)) {
            <tr class="group text-sm transition-colors hover:bg-main/[0.04]">
              <td class="whitespace-nowrap border-b border-neutral-100 px-3 py-3 text-center text-xxs font-semibold text-neutral-400">{{ startRecord + $index + 1 }}</td>
              @for (header of tableConstructor; track $index) {
                <td class="max-w-64 overflow-hidden text-ellipsis whitespace-nowrap border-b border-neutral-100 px-3 py-3 text-sm text-neutral-700" [title]="getCellText(row, header)">
                  @if (header.isDate) {
                    <span class="text-xs font-medium text-neutral-500">
                      {{ getDateTransformed(getNestedValue(row, header.key)) }}
                    </span>
                  } @else if (header.isId) {
                    <span class="text-xs font-semibold text-neutral-600">
                      {{ getNestedValue(row, header.key) }}
                    </span>
                  } @else if (header.isNew) {
                    @if (getNestedValue(row, header.key) === 'Nuevo') {
                      <span class="badge bg-amber-100 text-amber-800">Nuevo</span>
                    } @else {
                      <span class="badge bg-sky-100 text-sky-700">{{ getNestedValue(row, header.key) || 'Visto' }}</span>
                    }
                  } @else if (header.isDependencia) {
                    <span>{{ getDependenciaName(getNestedValue(row, header.key)) || '-' }}</span>
                  } @else if (header.isDocumento) {
                    <span>{{ getDocumentoName(getNestedValue(row, header.key)) || '-' }}</span>
                  } @else if (header.isFormat) {
                    <span class="badge bg-neutral-100 text-neutral-600">{{ getFormatLabel(getNestedValue(row, header.key)) }}</span>
                  } @else if (header.isSize) {
                    <span class="badge bg-neutral-100 text-neutral-600">
                      <fa-icon class="text-neutral-500" [icon]="Document"></fa-icon>{{ formatFileSize(getNestedValue(row, header.key)) }}
                    </span>
                  } @else if (header.isRole) {
                    @switch (getNestedValue(row, header.key)) {
                      @case ('SUPERADMIN') {
                        <span class="badge bg-rose-100 text-rose-700">
                          <fa-icon [icon]="Super"></fa-icon>ADMIN
                        </span>
                      }
                      @case ('BOSS') {
                        <span class="badge bg-sky-100 text-sky-700">
                          <fa-icon [icon]="Boss"></fa-icon>JEFE
                        </span>
                      }
                      @case ('OPERATOR') {
                        <span class="badge bg-emerald-100 text-emerald-700">
                          <fa-icon [icon]="Operator"></fa-icon>ASISTENTE
                        </span>
                      }
                      @default { <span>{{ getNestedValue(row, header.key) || '-' }}</span> }
                    }
                  } @else {
                    {{ displayValue(getNestedValue(row, header.key)) }}
                  }
                </td>
              }
              <td class="whitespace-nowrap border-b border-neutral-100 px-3 py-2">
                <div class="flex items-center justify-center gap-1.5">
                  @for (btn of actions; track btn.action) {
                    @if (isActionVisible(btn, row)) {
                      <button type="button" (click)="action.emit({ action: btn.action, item: row })" [class]="btn.color + ' rounded-lg p-2 outline-none transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-main'" [title]="btn.title">
                        <fa-icon [icon]="btn.icon" class="text-sm"></fa-icon>
                      </button>
                    }
                  }
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td [attr.colspan]="tableConstructor.length + 2" class="px-4 py-10 text-center text-sm text-neutral-500">
                {{ searchTerm.trim() ? 'No se encontraron registros que coincidan con la búsqueda.' : 'No hay registros para mostrar.' }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- All -->
      <div class="text-xs text-neutral-500" aria-live="polite">
        Mostrando {{ filteredData.length ? startRecord + 1 : 0 }}–{{ endRecord }} de {{ filteredData.length }} registros
      </div>
      <!-- Paginate -->
      <nav class="flex items-center justify-center gap-1 sm:justify-end" aria-label="Paginación de la tabla">
        <!-- Previous -->
        <button type="button" (click)="prevPage()" [disabled]="currentPage === 1" aria-label="Página anterior" class="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 outline-none transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-main disabled:cursor-not-allowed disabled:text-neutral-300">
          <fa-icon [icon]="Previous"></fa-icon>
        </button>
        <!-- Pages -->
        <div class="flex items-center gap-1">
          @for (page of pageNumbers; track page) {
            <button type="button" (click)="goToPage(page)" [attr.aria-label]="'Página ' + page" [attr.aria-current]="currentPage === page ? 'page' : null" [ngClass]="currentPage === page ? 'bg-main text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'" class="h-9 min-w-9 rounded-xl px-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-main">
              {{ page }}
            </button>
          }
        </div>
        <!-- Next -->
        <button type="button" (click)="nextPage()" [disabled]="currentPage === totalPages" aria-label="Página siguiente" class="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-600 outline-none transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-main disabled:cursor-not-allowed disabled:text-neutral-300">
          <fa-icon [icon]="Next"></fa-icon>
        </button>
      </nav>
    </div>
  `,
  styles: ``,
})
export class TableComponent {
  @Input() tableConstructor: {
    key: string,
    label: string,
    isId?: boolean,
    isDate?: boolean,
    isDependencia?: boolean,
    isDocumento?: boolean,
    isSize?: boolean,
    isFormat?: boolean,
    isRole?: boolean,
    isNew?: boolean,
  }[] = [];
  @Input() data: any[] = [];
  @Input() actions: { action: string; icon: IconDefinition; color: string; title: string, ownership?: boolean; hiddenWhen?: string[] }[] = [];
  @Output() action = new EventEmitter<{ action: string; item: any }>();

  dependencias = inject(DependenciasService).dependencias;
  usuarios = inject(UsuariosService).usuarios;
  documentos = inject(DocumentosService).documentos;
  currentUser = inject(AuthService).usuarioLogged;

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

  // Size
  Document = faFileLines;

  // Role
  Super = faUserShield;
  Boss = faUserTie;
  Operator = faUser;

  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  startRecord = 0;
  endRecord = 0;

  filteredData: any[] = [];
  paginatedData: any[] = [];

  get pageNumbers(): number[] {
    const visibleCount = Math.min(this.totalPages, 5);
    const start = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - visibleCount + 1));
    return Array.from({ length: visibleCount }, (_, index) => start + index);
  }

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
      if (acc === null || acc === undefined) return undefined;

      const arrayRegex = /^([a-zA-Z0-9_]+)\[(\d+)\]$/;

      if (arrayRegex.test(part)) {
        const [, arrayKey, indexStr] = part.match(arrayRegex)!;
        const index = parseInt(indexStr, 10);

        return acc[arrayKey]?.[index];
      }

      return acc[part];
    }, obj);
  }

  isActionVisible(action: { ownership?: boolean; hiddenWhen?: string[] }, row: any): boolean {
    const ownsRecord = !action.ownership || this.currentUser()?.uid === this.getNestedValue(row, 'propietario.ownerId');
    const isHidden = action.hiddenWhen?.some(field => Boolean(this.getNestedValue(row, field))) ?? false;
    return ownsRecord && !isHidden;
  }

  getDateTransformed(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    try {
      const date = value instanceof Timestamp
        ? value.toDate()
        : value instanceof Date || typeof value === 'string' || typeof value === 'number'
          ? value
          : null;
      if (date === null || Number.isNaN(new Date(date).getTime())) return '-';
      return formatDate(date, 'EEE dd MMM, HH:mm', 'es').replace(/\b\w/g, letter => letter.toUpperCase());
    } catch {
      return '-';
    }
  }

  displayValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (Array.isArray(value)) return value.map(item => this.displayValue(item)).join(', ') || '-';
    if (typeof value === 'object') return '-';
    return String(value);
  }

  getFormatLabel(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) return 'Archivo';
    const normalized = value.toLowerCase().trim();
    const format = normalized.split('/').pop()!.split('.').pop()!;
    if (normalized.includes('pdf')) return 'PDF';
    if (normalized.includes('word') || format === 'doc' || format === 'docx') return 'Word';
    if (normalized.includes('excel') || normalized.includes('sheet') || format === 'xls' || format === 'xlsx') return 'Excel';
    if (normalized.includes('powerpoint') || normalized.includes('presentation') || format === 'ppt' || format === 'pptx') return 'PowerPoint';
    return format.toUpperCase();
  }

  formatFileSize(value: unknown): string {
    if (value === null || value === undefined || value === '') return '-';
    const bytes = Number(value);
    return Number.isFinite(bytes) && bytes >= 0 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : '-';
  }

  getCellText(row: any, header: { key: string; isDate?: boolean; isDependencia?: boolean; isDocumento?: boolean; isFormat?: boolean; isSize?: boolean; isRole?: boolean }): string {
    const value = this.getNestedValue(row, header.key);
    if (value === null || value === undefined) return '';

    const values = [this.displayValue(value)];
    if (header.isDate) {
      values.push(this.getDateTransformed(value));
      const dateNumber = this.toDateNumber(value);
      if (dateNumber) values.push(new Date(dateNumber).toISOString());
    }
    if (header.isDependencia) values.push(this.getDependenciaName(String(value)));
    if (header.isDocumento) values.push(this.getDocumentoName(String(value)));
    if (header.isFormat) values.push(this.getFormatLabel(value));
    if (header.isSize) values.push(this.formatFileSize(value));
    if (header.isRole) {
      const roleLabels: Record<string, string> = { SUPERADMIN: 'ADMIN', BOSS: 'JEFE', OPERATOR: 'ASISTENTE' };
      values.push(roleLabels[String(value)] ?? '');
    }
    return values.filter(Boolean).join(' ').toLocaleLowerCase('es');
  }

  getRowKey(row: any, index: number): string | number {
    return row?.id ?? row?.uid ?? row?.codigo ?? row?.codigoTicket ?? index;
  }

  getDependenciaName(dependenciaId: string) {
    const dependencia = this.dependencias().find(d => d.id === dependenciaId);
    return dependencia ? dependencia.nombre : '';
  }

  getDocumentoName(documentoId: string) {
    const documento = this.documentos().find(d => d.id === documentoId);
    return documento ? documento.asunto : '';
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    const normalizedSearch = this.searchTerm.trim().toLocaleLowerCase('es');
    this.filteredData = this.data.filter(row => !normalizedSearch || this.tableConstructor.some(header => {
      const rawValue = this.getNestedValue(row, header.key);
      const rawText = rawValue === null || rawValue === undefined ? '' : String(rawValue).toLocaleLowerCase('es');
      return rawText.includes(normalizedSearch) || this.getCellText(row, header).includes(normalizedSearch);
    }));

    if (this.sortColumn) this.sortFilteredData();

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

    this.currentPage = 1;
    this.sortFilteredData();

    this.updatePagination();
  }

  private sortFilteredData() {
    const header = this.tableConstructor.find(column => column.key === this.sortColumn);
    if (!header) return;

    this.filteredData.sort((a, b) => {
      const valueA = this.getNestedValue(a, this.sortColumn);
      const valueB = this.getNestedValue(b, this.sortColumn);
      let comparison: number;

      if (header.isDate) {
        comparison = this.toDateNumber(valueA) - this.toDateNumber(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else {
        comparison = this.getCellText(a, header).localeCompare(this.getCellText(b, header), 'es', { numeric: true, sensitivity: 'base' });
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  private toDateNumber(value: unknown): number {
    if (value instanceof Timestamp) return value.toMillis();
    if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
      const time = new Date(value).getTime();
      return Number.isNaN(time) ? 0 : time;
    }
    return 0;
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
    this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    this.updatePagination();
  }
}