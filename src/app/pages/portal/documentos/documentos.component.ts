import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { faDownload, faEdit, faFileLines, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DocumentosService } from '../../../services/documentos.service';
import { Documento } from '../../../interfaces/documento';
import { DocumentoModalComponent } from "../../../components/documento-modal/documento-modal.component";
import { TableComponent } from "../../../components/table/table.component";
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";

@Component({
  selector: 'app-documentos',
  imports: [FontAwesomeModule, BreadcrumbComponent, DocumentoModalComponent, TableComponent, ConfirmacionEliminarModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-10 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Documentos'"></app-breadcrumb>
      <div class="flex items-center -mt-3 justify-between">
        <h1 class="text-main text-4xl font-bold">Documentos</h1>
        <button (click)="onAdd()" type="button" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 rounded-full">
          <fa-icon [icon]="Add"></fa-icon> Agregar
        </button>
      </div>
      <!-- Table -->
      <app-table
        [tableConstructor]="tableHeaders"
        [data]="documentos()"
        [actions]="tableActions"
        (action)="handleAction($event)"
      ></app-table>
    </div>

    @if (isDocumentoModalOpen()) {
      <app-documento-modal
        [documento]="selectedDocumento()"
        (close)="isDocumentoModalOpen.set(false)"
      ></app-documento-modal>
    }

    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar el documento ' + selectedDocumento()!.codigo + '-' + selectedDocumento()!.archivo.nombreArchivo"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class DocumentosComponent {
  private documentosService = inject(DocumentosService);
  documentos = this.documentosService.documentos;

  // Table
  tableHeaders = [
    { key: 'codigo', label: 'Código' },
    { key: 'archivo.nombreArchivo', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'archivo.formato', label: 'Formato', isFormat: true},
    { key: 'archivo.peso', label: 'Peso', isSize: true },
    { key: 'archivo.fecha', label: 'Fecha', isDate: true },
  ];
  tableActions = [
    { action: 'download', icon: faDownload, color: 'text-sky-600', title: 'Descargar'},
    { action: 'edit', icon: faEdit, color: 'text-amber-400', title: 'Editar'},
    { action: 'delete', icon: faTrash, color: 'text-red-600', title: 'Eliminar'},
  ];

  // Modals
  isDocumentoModalOpen = signal(false);
  isDocumentoDownloadOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedDocumento = signal<Documento | null>(null);

  // Icons
  Document = faFileLines;
  Add = faPlus;
  Edit = faPenToSquare;
  Delete = faTrash;

  handleAction({action, item}: { action: string; item: any }) {
    switch (action) {
      case 'download':
        this.onDownload(item);
        break;
      case 'edit':
        this.onEdit(item);
        break;
      case 'delete':
        this.onDelete(item);
        break;
    }
  }

  onAdd() {
    this.selectedDocumento.set(null);
    this.isDocumentoModalOpen.set(true);
  }

  onDownload(documento: Documento) {
    this.selectedDocumento.set(documento);
    this.isDocumentoDownloadOpen.set(true);
  }

  onEdit(documento: Documento) {
    this.selectedDocumento.set(documento);
    this.isDocumentoModalOpen.set(true);
  }

  onDelete(documento: Documento) {
    this.selectedDocumento.set(documento);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedDocumento()?.id) {
      this.documentosService.deleteDocumento(this.selectedDocumento()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}
