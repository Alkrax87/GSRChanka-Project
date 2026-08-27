import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Tramite } from '../../interfaces/tramite';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileLines, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { TramitesService } from '../../services/tramites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tramite-derivar',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
        <h2 class="text-xl font-semibold">Derivar Trámite</h2>
        <p class="text-sm text-neutral-500">Selecciona el área a derivar el trámite.</p>
        <!-- Detalle trámite -->
        <div class="flex flex-col gap-2 mt-4">
          <!-- Nombre -->
          <div>
            <p class="text-main text-sm font-semibold">Nombre</p>
            <p class="text-neutral-700 font-semibold">{{ tramite!.asunto }}</p>
          </div>
          <!-- Área -->
          <div>
            <p class="text-main text-sm font-semibold">Área Origen</p>
            <p class="text-neutral-700 font-semibold">{{ tramite!.areaActual }}</p>
          </div>
          <!-- Documentos -->
          @if (tramite.documentos) {
            <div>
              <h3 class="text-main text-sm font-semibold"><fa-icon [icon]="Document"></fa-icon> Documentos adjuntos ({{ tramite.documentos.length }})</h3>
              @if (tramite.documentos.length > 0) {
                @for (document of tramite.documentos; track $index) {
                  <p class="text-neutral-500 text-sm truncate">- {{ document.nombre }}</p>
                }
              }
            </div>
          }
        </div>
        <!-- Área -->
        <form [formGroup]="form" class="mt-2">
          <p class="text-main font-semibold mb-3">Derivar a:</p>
          <div class="flex flex-col gap-4">
            <!-- Área destino -->
            <div>
              <label for="areaDestino" class="relative">
                <select id="areaDestino" formControlName="areaDestino" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <div class="rounded-lg overflow-hidden">
                    <option value="" disabled selected hidden></option>
                    <!-- @for (area of filteredAreas(); track $index) {
                      <option [value]="area.id" class="hover:bg-main hover:text-red-700 h-20">{{ area.nombre }}</option>
                    } -->
                  </div>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Área Destino</span>
              </label>
            </div>
            <!-- Observaciones -->
            <div>
              <label for="observaciones" class="relative">
                <textarea id="observaciones" formControlName="observaciones" placeholder=" " rows="4" class="bg-white text-neutral-700 border focus:border-main focus:text-main cursor-text px-5 py-3 peer w-full rounded-2xl shadow-sm duration-100 outline-none resize-none"></textarea>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text absolute start-3 -top-[92px] px-2 text-xs font-semibold transition-transform -translate-y-[22px] peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-[22px]">Observaciones</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            <button type="submit" (click)="derivar()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
              <fa-icon [icon]="Send"></fa-icon>&nbsp; Derivar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteDerivarComponent {
  @Input() tramite!: Tramite;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tramitesService =inject(TramitesService);
  // areas = inject(AreaService).areas;
  // filteredAreas = signal<Area[]>([]);
  currentArea = inject(AuthService).usuarioLogged()!.dependenciaId;
  user = inject(AuthService).usuarioLogged()!.uid;

  Document = faFileLines;
  Send = faShareFromSquare;

  form = this.fb.group({
    areaDestino: ['', Validators.required],
    observaciones: [''],
  });

  ngOnInit() {
    // this.filteredAreas.set(this.getFilteredAreas())
  }

  // getFilteredAreas(): Area[] {
  //   return this.areas().filter(a => a.id !== this.currentArea);
  // }

  derivar() {
    if (this.form.invalid || !this.tramite) return;

    const areaDestino = this.form.value.areaDestino!;

    this.tramite.areaActual = areaDestino;

    this.tramite.trazabilidad[0].areaDestino = areaDestino;
    this.tramite.trazabilidad[0].fechaSalida = new Date();
    this.tramite.trazabilidad[0].estado = 'Completado';

    this.tramite.trazabilidad.unshift({
      areaOrigen: this.currentArea,
      areaDestino: null,
      fechaIngreso: new Date(),
      fechaSalida: null,
      responsable: this.user!,
      prioridad: 'Sin Determinar',
      estado: 'Pendiente',
      observaciones: this.form.value.observaciones || '',
    });

    this.tramitesService.updateTramite(this.tramite.id!, this.tramite);
    this.close.emit();
  }
}