import { Component, inject, signal } from '@angular/core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { ExpedienteModalComponent } from '../../../../components/expediente-modal/expediente-modal.component';
import { TableComponent } from '../../../../components/table/table.component';
import { Expediente } from '../../../../interfaces/expediente';
import { ExpedientesService } from '../../../../services/expedientes.service';

@Component({
  selector: 'app-iniciados',
  imports: [BreadcrumbComponent, TableComponent, ExpedienteModalComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Expedientes'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Iniciados aquí</h1>
      </div>
      <!-- Content -->
      <div class="card">
        <!-- Table -->
        <app-table
          [tableConstructor]="tableHeaders"
          [data]="expedientes()"
          [actions]="tableActions"
          (action)="handleAction($event)"
        ></app-table>
      </div>
    </div>

    @if (isModalOpen()) {
      <app-expediente-modal [expediente]="selectedExpediente()" (close)="isModalOpen.set(false)"></app-expediente-modal>
    }
  `,
  styles: ``,
})
export class ExpedientesIniciadosComponent {
  private expedientesService = inject(ExpedientesService);

  expedientes = this.expedientesService.expedientesIniciados;

  tableHeaders = [
    { key: 'codigoTicket', label: 'Ticket', isId: true },
    { key: 'fechaCierre', label: 'Fecha de Cierre', isDate: true },
    { key: 'dependenciaFinal', label: 'Finalizado por', isDependencia: true },
    { key: 'documentosAdjuntos.length', label: 'Documentos' },
  ];
  tableActions = [
    { action: 'show', icon: faEye, color: 'text-main', title: 'Ver' },
  ];

  // Modals
  isModalOpen = signal(false);
  selectedExpediente = signal<Expediente | null>(null);

  constructor() {
    this.expedientesService.getExpedientesIniciados();
  }

  handleAction({ action, item }: { action: string; item: Expediente }) {
    if (action !== 'show') return;
    this.selectedExpediente.set(item);
    this.isModalOpen.set(true);
  }
}
