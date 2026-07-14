import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { faDownload, faEdit, faFileLines, faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DocumentosService } from '../../../services/documentos.service';
import { Documento } from '../../../interfaces/documento';
import { DocumentoModalComponent } from "../../../components/documento-modal/documento-modal.component";
import { TableComponent } from "../../../components/table/table.component";
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { DocumentoDownloadModalComponent } from "../../../components/documento-download-modal/documento-download-modal.component";
import { AreaService } from '../../../services/area.service';

@Component({
  selector: 'app-documentos',
  imports: [FaIconComponent, BreadcrumbComponent, DocumentoModalComponent, TableComponent, ConfirmacionEliminarModalComponent, DocumentoDownloadModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-10 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Documentos'"></app-breadcrumb>
      <div class="flex items-center -mt-3 justify-between">
        <h1 class="text-main text-4xl font-bold">Documentos</h1>
        <button (click)="onAdd()" type="button" class="btn bg-main hover:bg-main-hover text-white flex items-center gap-2">
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

    @if (isDocumentoDownloadOpen()) {
      <app-documento-download-modal
        [documento]="selectedDocumento()!"
        (close)="isDocumentoDownloadOpen.set(false)"
      ></app-documento-download-modal>
    }

    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar el documento ' + selectedDocumento()!.codigo + '-' + selectedDocumento()!.archivo.nombreArchivo + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class DocumentosComponent {
  private documentosService = inject(DocumentosService);
  private areasService = inject(AreaService);

  documentos = this.documentosService.documentos;

  // Table
  tableHeaders = [
    { key: 'codigo', label: 'Código' },
    { key: 'asunto', label: 'Asunto' },
    { key: 'archivo.nombreArchivo', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'archivo.formato', label: 'Formato', isFormat: true},
    { key: 'archivo.peso', label: 'Peso', isSize: true },
    { key: 'fechaModificacion', label: 'Fecha Modificación', isDate: true },
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
      this.areasService.changeTotal(this.selectedDocumento()!.adjuntadoPorArea, -1);
      this.documentosService.deleteFile(this.selectedDocumento()!.archivo.ruta);
      this.documentosService.deleteDocumento(this.selectedDocumento()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}
