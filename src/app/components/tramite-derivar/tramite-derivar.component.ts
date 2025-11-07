import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Tramite } from '../../interfaces/tramite';
import { AreaService } from '../../services/area.service';
import { Area } from '../../interfaces/area';
import { Subscription } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faFileLines, faUser } from '@fortawesome/free-solid-svg-icons';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { TramitesService } from '../../services/tramites.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-tramite-derivar',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 w-1/3 shadow-xl">
        <h2 class="text-xl font-semibold">Derivar Trámite</h2>
        <p class="text-sm text-neutral-500">Revisa los datos a continuación antes de derivar el trámite.</p>
        <div class="flex flex-col gap-5 my-3">
          <div>
            <h3 class="text-main font-semibold">Detalles del Trámite</h3>
            <div class="border border-main rounded-xl p-3">
              <div class="flex gap-2">
                <div class="bg-main rounded-lg text-white text-2xl p-2 w-12 h-12 text-center">
                  <fa-icon [icon]="Document"></fa-icon>
                </div>
                <div class="text-main text-lg font-semibold my-auto">{{ tramite?.nombre }}</div>
              </div>
              <p class="text-neutral-600 text-sm mt-2">{{ tramite?.descripcion }}</p>
            </div>
          </div>
          <div>
            <h3 class="text-main font-semibold">Información del Trámite</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="border border-main rounded-xl p-4">
                <p class="text-main font-semibold text-xs"><fa-icon [icon]="User"></fa-icon> Autor</p>
                <p class="text-neutral-600 text-sm">{{ usuario.nombres + ' ' + usuario.apellidos }}</p>
              </div>
              <div class="border border-main rounded-xl p-4">
                <p class="text-main font-semibold text-xs"><fa-icon [icon]="Area"></fa-icon> Area</p>
                <p class="text-neutral-600 text-sm">{{ tramite?.ubicacionActual?.area }}</p>
              </div>
            </div>
          </div>
          <form [formGroup]="form" (ngSubmit)="derivar()">
            <div class="flex flex-col gap-4 my-4">
              <div>
                <label for="areaDestino" class="relative">
                  <select id="areaDestino" formControlName="areaDestino" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                    <option value="" disabled selected hidden></option>
                    @for (area of areas; track $index) {
                      <option [value]="area.id" class="hover:bg-main hover:text-red-700 h-20">{{ area.nombrearea }}</option>
                    }
                  </select>
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Área Destino</span>
                </label>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
              <button type="submit" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
                &nbsp; Derivar Trámite
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteDerivarComponent {
  @Input() tramite!: Tramite | null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tramitesService =inject(TramitesService);
  private areasService = inject(AreaService);
  private usuariosService = inject(UsuariosService);

  private areaSubscription: Subscription | null = null;
  private usuarioSubscription: Subscription | null = null;
  areas:Area[] = [];
  usuario!: Usuario;

  Document = faFileLines;
  User = faUser;
  Area = faBuilding;

  form = this.fb.group({
    areaDestino: ['', Validators.required],
  });

  ngOnInit() {
    this.areaSubscription = this.areasService.getAreas().subscribe({
      next: (data) => (this.areas = data)
    });
    this.usuariosService.dataUsuario$.subscribe({
      next: (data) => (this.usuario = data!)
    });
  }

  derivar() {
    if (this.form.invalid || !this.tramite) return;

    const now = formatDate(new Date(), 'EEE dd MMM, HH:mm', 'es');
    const areaDestino = this.form.value.areaDestino;

    const trazabilidad = [...this.tramite.trazabilidadAreas];
    const ultimaArea = trazabilidad[trazabilidad.length - 1];

    ultimaArea.fechaSalida = now.replace(/\b\w/g, l => l.toUpperCase());
    ultimaArea.estado = 'Completado';

    trazabilidad.push({
      area: areaDestino!,
      fechaIngreso: now.replace(/\b\w/g, l => l.toUpperCase()),
      estado: 'Pendiente'
    });

    this.tramitesService.updateTramite(this.tramite.id!, {
      ubicacionActual: {
        area: areaDestino!,
        fechaIngreso: now.replace(/\b\w/g, l => l.toUpperCase()),
        estado: 'Pendiente'
      },
      trazabilidadAreas: trazabilidad
    });

    this.close.emit();
  }

  ngOnDestroy() {
    this.areaSubscription?.unsubscribe();
    this.usuarioSubscription?.unsubscribe();
  }
}
