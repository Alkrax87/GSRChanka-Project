import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TableComponent } from "../../../components/table/table.component";
import { AreaModalComponent } from "../../../components/area-modal/area-modal.component";
import { AreaShowModalComponent } from "../../../components/area-show-modal/area-show-modal.component";
import { ConfirmacionEliminarModalComponent } from "../../../components/confirmacion-eliminar-modal/confirmacion-eliminar-modal.component";
import { UsuariosService } from '../../../services/usuarios.service';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Usuario } from '../../../interfaces/usuario';
import { InversionService } from '../../../services/inversion.service';
import { Inversion } from '../../../interfaces/inversion';
import { InversionModalComponent } from "../../../components/inversion-modal/inversion-modal.component";
import { InversionShowModalComponent } from '../../../components/inversion-show-modal/inversion-show-modal.component';
@Component({
  selector: 'app-inversion',
  imports: [TableComponent, FontAwesomeModule, ConfirmacionEliminarModalComponent, InversionShowModalComponent, InversionModalComponent],
  template: `
    <div class="flex flex-col gap-5 p-2 sm:p-10 select-none">
      <p class="text-neutral-400 text-xs font-semibold">
        <span class="text-main">Inversion</span>
      </p>
      <div class="flex items-center -mt-5 justify-between">
        <h1 class="text-main text-4xl font-bold">INVERSION</h1>
        <button (click)="openCreate()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
          <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar Inversión
        </button>
      </div>
      <app-table [tableConstructor]="headers"
        [data]="inversiones()"
        (onEdit)="openEdit($event)"
        (onDelete)="openDelete($event)"
        (onShow)="openShow($event)"
      ></app-table>
    </div>

   @if (isInversionModalOpen()) {
      <app-inversion-modal
        [inversion]="selectedInversion()"
        (close)="isInversionModalOpen.set(false)"
      ></app-inversion-modal>
    }
    @if (isInversionShowOpen()) {
      <app-inversion-show-modal
        [inversion]="selectedInversion()!"
        (close)="isInversionShowOpen.set(false)"
      ></app-inversion-show-modal>
    }
     @if (isConfirmOpen()) {
      <app-confirmacion-eliminar-modal
        [message]="'¿Eliminar el área ' + selectedInversion()!.nombreinversion + '?'"
        (confirm)="confirmDelete()"
        (cancel)="isConfirmOpen.set(false)"
      ></app-confirmacion-eliminar-modal>
    }
  `,
  styles: ``
})
export class InversionComponent {
  private inversionService = inject(InversionService);
  private usuariosService = inject(UsuariosService);

  headers = [
    { key: 'cui', label: 'CUI' },
    { key: 'nombreinversion', label: 'Nombre Inversion' },
    { key: 'residente', label: 'Residente' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'distrito', label: 'Distrito' },
    { key: 'provincia', label: 'Provincia' },
    { key: 'fecha_inicio', label: 'Fecha Inicio' },
    { key: 'fecha_final', label: 'Fecha Final' },
    { key: 'prosupuesto_ejecucion', label: 'Prosupuesto Ejecucion' },
    { key: 'miembros_inversion', label: 'Miembros de Obra' }
  ];

  // Signals
  inversiones = signal<Inversion[]>([]);
  usuarios = signal<Usuario[]>([]);
  isInversionModalOpen = signal(false);
  isInversionShowOpen = signal(false);
  isConfirmOpen = signal(false);
  selectedInversion = signal<Inversion | null>(null);

  // Icons
  Add = faPlus;

  constructor() {
    combineLatest([
      this.inversionService.getInversion(),
      this.usuariosService.getUsers(),
    ]).pipe(takeUntilDestroyed()).subscribe({
      next: ([inversiones, usuarios]) => {
        this.inversiones.set(inversiones.map((inversion) => {
            const residente = usuarios.find((r) => r.id === inversion.residente);
            const supervisor = usuarios.find((s) => s.id === inversion.supervisor);
            const nuevaInversion = {
              ...inversion,
              residente: residente
                ? `${residente.nombres} ${residente.apellidos}`
                : 'Sin residente',
              supervisor: supervisor
                ? `${supervisor.nombres} ${supervisor.apellidos}`
                : 'Sin supervisor',
            };

            return nuevaInversion;
          })
        );
        this.usuarios.set(usuarios);

        console.log(this.inversiones()); // 👈 Verifica aquí que se muestren los nombres
      },
    });
  }
  openCreate() {
    this.selectedInversion.set(null);
    this.isInversionModalOpen.set(true);
  }

  openShow(inversion: Inversion) {
    this.selectedInversion.set(inversion);
    this.isInversionShowOpen.set(true);
  }

  openEdit(inversion: Inversion) {
    this.selectedInversion.set(inversion);
    this.isInversionModalOpen.set(true);
  }

  openDelete(inversion: Inversion) {
    this.selectedInversion.set(inversion);
    this.isConfirmOpen.set(true);
  }

  confirmDelete() {
    if (this.selectedInversion()?.id) {
      this.inversionService.deleteInversion(this.selectedInversion()!.id!);
    }
    this.isConfirmOpen.set(false);
  }
}
