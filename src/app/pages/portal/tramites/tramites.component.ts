import { Component, inject, signal } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { AreaService } from '../../../services/area.service';
import { TramitesService } from '../../../services/tramites.service';
import { Tramite } from '../../../interfaces/tramite';
import { faEdit, faEye, faFolderOpen, faPlus, faShareFromSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableComponent } from '../../../components/table/table.component';
import { TramiteModalComponent } from "../../../components/tramite-modal/tramite-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { Area } from '../../../interfaces/area';
import { FormsModule } from '@angular/forms';
import { TramiteAdjuntarComponent } from "../../../components/tramite-adjuntar/tramite-adjuntar.component";
import { TramiteDerivarComponent } from "../../../components/tramite-derivar/tramite-derivar.component";
import { combineLatest, filter, map, Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-tramites',
  imports: [TableComponent, FontAwesomeModule, TramiteModalComponent, ConfirmacionEliminarModalComponent, FormsModule, TramiteAdjuntarComponent, TramiteDerivarComponent],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <p class="text-neutral-400 text-xs font-semibold">
        <span class="text-main">Tramites</span>
      </p>
      <div class="flex items-center -mt-5 justify-between">
        <h1 class="text-main text-4xl font-bold">TRÁMITES</h1>
        <button (click)="openCreate()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar Trámite
        </button>
      </div>
      <app-table
        [tableConstructor]="tableHeaders"
        [data]="tramites()"
        [actions]="tableActions"
        (action)="handleAction($event)"
      >
      </app-table>
    </div>

    @if (isTramiteModalOpen()) {
      <app-tramite-modal
        [tramite]="selectedTramite()"
        [currentArea]="currentArea"
        (close)="isTramiteModalOpen.set(false)"
      ></app-tramite-modal>
    }
    @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar el trámite ' + selectedTramite()!.nombre + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
    @if (isAdjuntarOpen()) {
      <app-tramite-adjuntar
        [tramite]="selectedTramite()"
        (close)="isAdjuntarOpen.set(false);"
      ></app-tramite-adjuntar>
    }
    @if (isDerivarOpen()) {
      <app-tramite-derivar
        [tramite]="selectedTramite()"
        [currentArea]="currentArea"
        (close)="isDerivarOpen.set(false);"
      ></app-tramite-derivar>
    }
  `,
  styles: ``,
})
export class TramitesComponent {
  private usuariosService = inject(UsuariosService);
  private areasService = inject(AreaService);
  private tramitesService = inject(TramitesService);

  private dataSubscription: Subscription | null = null;
  currentArea: string = '';
  tableHeaders = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'correspondencia.actual.asunto', label: 'Asunto' },
    { key: 'ubicacionActual.estado', label: 'Estado', status: true },
    { key: 'correspondencia.actual.remitente', label: 'Remitente' },
    { key: 'correspondencia.actual.destinatario', label: 'Destinatario' },
    { key: 'trazabilidadAreas[0].area', label: 'Área' },
    { key: 'ubicacionActual.fechaIngreso', label: 'Fecha De Ingreso' },
  ];
  tableActions = [
    { action: 'show', icon: faEye, color: 'text-main', title: 'Ver'},
    { action: 'edit', icon: faEdit, color: 'text-yellow-400', title: 'Editar'},
    { action: 'delete', icon: faTrash, color: 'text-red-600', title: 'Eliminar'},
    { action: 'files', icon: faFolderOpen, color: 'text-neutral-600', title: 'Adjuntar'},
    { action: 'send', icon: faShareFromSquare, color: 'text-green-600', title: 'Derivar'},
  ]

  // Signals
  tramites = signal<Tramite[]>([]);
  areas = signal<Area[]>([]);
  isTramiteModalOpen = signal(false);
  isTramiteShowOpen = signal(false);
  isConfirmOpen = signal(false);
  isAdjuntarOpen = signal(false);
  isDerivarOpen = signal(false);
  selectedTramite = signal<Tramite | null>(null);

  //Icons
  Add = faPlus;

  ngOnInit() {
    this.dataSubscription = combineLatest([
      this.usuariosService.dataUsuario$,
      this.areasService.getAreas(),
    ])
    .pipe(
      map(([user, areas]) => areas.find(a => a.rolAsociado === user?.rol)?.id),
      filter((areaId): areaId is string => !!areaId),
      tap(areaId => this.currentArea = areaId),
      switchMap(areaId => this.tramitesService.getTramites(areaId)),
    )
    .subscribe(data => {
      this.tramites.set(data);
    });
  }

  handleAction({action, item}: { action: string; item: any }) {
    switch (action) {
      case 'show':
        this.openShow(item);
        break;
      case 'edit':
        this.openEdit(item);
        break;
      case 'delete':
        this.openDelete(item);
        break;
      case 'files':
        this.openAdjuntar(item);
        break;
      case 'send':
        this.openDerivar(item);
        break;
    }
  }

  openCreate() {
    this.selectedTramite.set(null);
    this.isTramiteModalOpen.set(true);
  }

  openShow(tramite: Tramite) {
    this.selectedTramite.set(tramite);
    this.isTramiteShowOpen.set(true);
  }

  openEdit(tramite: Tramite) {
    this.selectedTramite.set(tramite);
    this.isTramiteModalOpen.set(true);
  }

  openDelete(tramite: Tramite) {
    this.selectedTramite.set(tramite);
    this.isConfirmOpen.set(true);
  }

  openAdjuntar(tramite: Tramite) {
    this.selectedTramite.set(tramite);
    this.isAdjuntarOpen.set(true);
  }

  openDerivar(tramite: Tramite) {
    this.selectedTramite.set(tramite);
    this.isDerivarOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedTramite()?.id) {
      this.tramitesService.deleteTramite(this.selectedTramite()!.id!);
    }
    this.isConfirmOpen.set(false);
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }
}