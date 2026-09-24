import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../../components/table/table.component';
import { TramitesService } from '../../../../services/tramites.service';
import { faEye, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Movimiento, Tramite } from '../../../../interfaces/tramite';
import { AuthService } from '../../../../services/auth.service';
import { TramiteTrackingComponent } from '../../../../components/tramite-tracking/tramite-tracking.component';

@Component({
  selector: 'app-enviados',
  imports: [BreadcrumbComponent, TableComponent, TramiteTrackingComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Trámites'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Enviados</h1>
      </div>
      <!-- Content -->
      <div class="card">
        <!-- Table -->
        <app-table
          [tableConstructor]="tableHeaders"
          [data]="tramitesMapeados()"
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
export class EnviadosComponent {
  private tramitesService = inject(TramitesService);
  currentUser = inject(AuthService).usuarioLogged;

  tramitesMapeados = computed(() => {
    return this.tramitesService.tramitesEnviados().map(tramite => {
      const miMovimiento = tramite.trazabilidad.find((m: Movimiento) => m.dependenciaEmisor === this.currentUser()?.dependenciaId);

      return {
        ...tramite,
        miFechaEnvio: miMovimiento?.fechaEnvio || null,
        miDestinoOriginal: miMovimiento?.dependenciaReceptor || 'N/A',
      };
    });
  });

  // Table
  tableHeaders = [
    { key: 'codigoTicket', label: 'Ticket', isId: true },
    { key: 'miDestinoOriginal', label: 'Derivado a', isDependencia: true },
    { key: 'miFechaEnvio', label: 'Fecha', isDate: true },
    { key: 'dependenciaActual', label: 'Ubicación Actual', isDependencia: true },
    { key: 'trazabilidad.length', label: 'N° de Derivaciones' },
    { key: 'estadoActual', label: 'Estado Global' },
  ];
  tableActions = [
    { action: 'track', icon: faMagnifyingGlass, color: 'text-[#F36845]', title: 'Seguimiento'},
  ]

  // Modals
  isTramitesTrackModalOpen = signal(false);
  selectedTramite = signal<Tramite | null>(null);

  constructor() {
    this.tramitesService.getTramitesEnviados();
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
