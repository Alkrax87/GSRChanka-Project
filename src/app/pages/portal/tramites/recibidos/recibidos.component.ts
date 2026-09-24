import { Component, computed, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../../../components/table/table.component';
import { TramitesService } from '../../../../services/tramites.service';
import { faFolderOpen, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Tramite } from '../../../../interfaces/tramite';
import { TramiteDerivarComponent } from '../../../../components/tramite-derivar/tramite-derivar.component';
import { TramiteAdjuntarComponent } from '../../../../components/tramite-adjuntar/tramite-adjuntar.component';

@Component({
  selector: 'app-recibidos',
  imports: [BreadcrumbComponent, TableComponent, TramiteDerivarComponent, TramiteAdjuntarComponent],
  template: `
    <div class="flex flex-col gap-4 p-8 select-none">
      <!-- Top -->
      <app-breadcrumb [path]="'Trámites'" class="-mb-2"></app-breadcrumb>
      <div class="flex items-center justify-between">
        <h1 class="text-main text-4xl font-bold">Recibidos</h1>
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

    @if (isTramitesFilesOpen()) {
      <app-tramite-adjuntar
        [tramite]="selectedTramite()!"
        (close)="isTramitesFilesOpen.set(false)"
      ></app-tramite-adjuntar>
    }

    @if (isTramitesSendOpen()) {
      <app-tramite-derivar
        [tramite]="selectedTramite()!"
        (close)="isTramitesSendOpen.set(false)"
      ></app-tramite-derivar>
    }
  `,
  styles: ``,
})
export class RecibidosComponent {
  private tramitesService = inject(TramitesService);

  tramitesMapeados = computed(() => {
    return this.tramitesService.tramitesRecibidos().map(tramite => {
      const ultimoMovimiento = tramite.trazabilidad[0];
      const esNuevo =  ultimoMovimiento.fechaRecepcion === null;

      return {
        ...tramite,
        estadoActual: esNuevo ? 'Nuevo' : 'Visto',
      };
    });
  });

  // Table
  tableHeaders = [
    { key: 'codigoTicket', label: 'Ticket', isId: true },
    { key: 'trazabilidad[0].dependenciaEmisor', label: 'Derivado por', isDependencia: true },
    { key: 'trazabilidad[0].usuarioEmisor', label: 'Usuario' },
    { key: 'trazabilidad[0].fechaEnvio', label: 'Fecha de Ingreso', isDate: true },
    { key: 'documentosAdjuntos.length', label: 'Adjuntos' },
    { key: 'estadoActual', label: 'Estado', isNew: true },
    { key: 'trazabilidad[0].observaciones', label: 'Observaciones' },
  ];
  tableActions = [
    { action: 'files', icon: faFolderOpen, color: 'text-amber-500', title: 'Adjuntar'},
    { action: 'send', icon: faShareFromSquare, color: 'text-green-600', title: 'Derivar'},
  ]

  // Modals
  isTramitesFilesOpen = signal(false);
  isTramitesSendOpen = signal(false);
  selectedTramite = signal<Tramite | null>(null);

  constructor() {
    this.tramitesService.getTramitesRecibidos();
  }

  handleAction({action, item}: { action: string; item: any }) {
    switch (action) {
      case 'files':
        this.onFiles(item);
        break;
      case 'send':
        this.onSend(item);
        break;
    }
  }

  onFiles(tramite: Tramite) {
    this.isTramiteRecieved(tramite);
    this.selectedTramite.set(tramite);
    this.isTramitesFilesOpen.set(true);
  }

  onSend(tramite: Tramite) {
    this.isTramiteRecieved(tramite);
    this.selectedTramite.set(tramite);
    this.isTramitesSendOpen.set(true);
  }

  isTramiteRecieved(tramite: Tramite) {
    if (tramite.trazabilidad[0].fechaRecepcion) {
      return;
    } else {
      const tramiteRecibido = [...tramite.trazabilidad]
      tramiteRecibido[0] = {
        ...tramiteRecibido[0],
        fechaRecepcion: new Date(),
      }

      this.tramitesService.updateTramite(tramite.id!, { trazabilidad: tramiteRecibido });
    }
  }
}
