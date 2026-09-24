import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../../components/table/table.component';
import { TramitesService } from '../../../../services/tramites.service';
import { Tramite } from '../../../../interfaces/tramite';
import { faEye, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { TramiteTrackingComponent } from '../../../../components/tramite-tracking/tramite-tracking.component';

@Component({
  selector: 'app-iniciados',
  imports: [BreadcrumbComponent, TableComponent, TramiteTrackingComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Trámites'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Iniciados</h1>
      </div>
      <!-- Content -->
      <div class="card">
        <!-- Tabñe -->
        <app-table
          [tableConstructor]="tableHeaders"
          [data]="tramites()"
          [actions]="tableActions"
          (action)="handleAction($event)"
        ></app-table>
      </div>
    </div>

    @if (isTramitesTrackModalOpen()) {
      <app-tramite-tracking
        [tramite]="selectedTramite()!"
        (close)="isTramitesTrackModalOpen.set(false)"
      ></app-tramite-tracking>
    }
  `,
  styles: ``,
})
export class IniciadosComponent {
  private tramitesService = inject(TramitesService);
  tramites = this.tramitesService.tramitesIniciados;

  // Table
  tableHeaders = [
    { key: 'codigoTicket', label: 'Ticket', isId: true },
    { key: 'documentoInicial', label: 'Asunto', isDocumento: true },
    { key: 'documentosAdjuntos.length', label: 'Documentos adjuntados' },
    { key: 'trazabilidad.length', label: 'N° de Derivaciones' },
    { key: 'dependenciaActual', label: 'Ubicación Actual', isDependencia: true },
    { key: 'trazabilidad[0].fechaEnvio', label: 'Último Movimiento', isDate: true },
    { key: 'estadoActual', label: 'Estado Global' },
  ];
  tableActions = [
    { action: 'show', icon: faEye, color: 'text-main', title: 'Ver'},
    { action: 'track', icon: faMagnifyingGlass, color: 'text-[#F36845]', title: 'Línea de Tiempo'},
  ];

  // Modals
  isTramitesTrackModalOpen = signal(false);
  selectedTramite = signal<Tramite | null>(null);

  constructor() {
    this.tramitesService.getTramitesIniciados();
  }

  handleAction({action, item}: { action: string; item: any }) {
    switch (action) {
      case 'track':
        this.onTrack(item);
        break;
    }
  }

  onTrack(tramite: Tramite) {
    this.selectedTramite.set(tramite);
    this.isTramitesTrackModalOpen.set(true);
  }
}
