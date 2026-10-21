import { Component, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faDownload, faEdit, faFileLines, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../components/table/table.component';
import { ConfirmacionEliminarModalComponent } from '../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component';
import { ArchivoRepositorioModalComponent } from '../../../components/archivo-repositorio-modal/archivo-repositorio-modal.component';
import { ArchivoRepositorioDownloadModalComponent } from '../../../components/archivo-repositorio-download-modal/archivo-repositorio-download-modal.component';
import { ArchivoRepositorio } from '../../../interfaces/archivo-repositorio';
import { RepositorioDigitalService } from '../../../services/repositorio-digital.service';

@Component({
  selector: 'app-repositorio-digital',
  imports: [FaIconComponent, BreadcrumbComponent, TableComponent, ConfirmacionEliminarModalComponent, ArchivoRepositorioModalComponent, ArchivoRepositorioDownloadModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Repositorio digital'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Repositorio digital</h1>
        <button type="button" (click)="onAdd()" class="btn-add">
          <fa-icon [icon]="Add"></fa-icon>Nuevo Archivo
        </button>
      </div>
      <!-- Content -->
      <div class="card">
        <!-- Table -->
        <app-table
          [tableConstructor]="tableHeaders"
          [data]="archivos()"
          [actions]="tableActions"
          (action)="handleAction($event)"
        ></app-table>
      </div>
    </div>

    @if (isModalOpen()) {
      <app-archivo-repositorio-modal
        [archivo]="selectedArchivo()"
        (close)="isModalOpen.set(false)"
      ></app-archivo-repositorio-modal>
    }
    @if (isDownloadOpen()) {
      <app-archivo-repositorio-download-modal
        [archivo]="selectedArchivo()!"
        (close)="isDownloadOpen.set(false)"
      ></app-archivo-repositorio-download-modal>
    }
    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar ' + selectedArchivo()!.nombre + ' (' + selectedArchivo()!.archivo.nombreArchivo + ')?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``,
})
export class RepositorioDigitalComponent {
  private repositorioService = inject(RepositorioDigitalService);
  archivos = this.repositorioService.archivos;

  // Table
  tableHeaders = [
    { key: 'nombre', label: 'Nombre', isId: true },
    { key: 'archivo.nombreArchivo', label: 'Nombre del archivo' },
    { key: 'archivo.formato', label: 'Formato', isFormat: true },
    { key: 'archivo.peso', label: 'Tamaño', isSize: true },
    { key: 'fechaCreacion', label: 'Fecha de creación', isDate: true },
    { key: 'fechaModificacion', label: 'Última modificación', isDate: true },
    { key: 'modificadoPor.nombre', label: 'Modificado por' },
  ];
  tableActions = [
    { action: 'download', icon: faDownload, color: 'text-sky-600', title: 'Descargar' },
    { action: 'edit', icon: faEdit, color: 'text-amber-500', title: 'Editar' },
    { action: 'delete', icon: faTrash, color: 'text-red-600', title: 'Eliminar' },
  ];

  // Modals
  isModalOpen = signal(false);
  isDownloadOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedArchivo = signal<ArchivoRepositorio | null>(null);

  // Icons
  Add = faPlus;
  File = faFileLines;

  handleAction({ action, item }: { action: string; item: ArchivoRepositorio }) {
    this.selectedArchivo.set(item);
    if (action === 'download') this.isDownloadOpen.set(true);
    if (action === 'edit') this.isModalOpen.set(true);
    if (action === 'delete') this.isConfirmOpen.set(true);
  }

  onAdd() {
    this.selectedArchivo.set(null);
    this.isModalOpen.set(true);
  }

  async confirmDelete() {
    const archivo = this.selectedArchivo();
    if (!archivo?.id) return;
    try {
      await this.repositorioService.deleteArchivo(archivo.id);
      this.isConfirmOpen.set(false);
      try {
        await this.repositorioService.deleteFile(archivo.archivo.ruta);
      } catch (storageError) {
        console.error('El registro se eliminó, pero no se pudo borrar el objeto de Storage:', storageError);
        alert('El registro se eliminó, pero no se pudo borrar el archivo de Storage.');
      }
    } catch (error) {
      console.error('Error eliminando archivo del repositorio:', error);
      alert(error instanceof Error ? error.message : 'No se pudo eliminar el archivo.');
      this.isConfirmOpen.set(false);
    }
  }
}
