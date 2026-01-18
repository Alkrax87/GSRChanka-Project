import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaService } from '../../services/area.service';
import { Area } from '../../interfaces/area';

@Component({
  selector: 'app-area-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">{{ area ? 'Editar Área' : 'Crear Área' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4 my-4">
            <div>
              <label for="nombre" class="relative">
                <input id="nombre" type="text" formControlName="nombre" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none"/>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombre</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            @if (area) {
              <button type="submit" [disabled]="form.invalid || isSaving" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
                @if (isSaving) {
                  <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Guardando...
                } @else {
                  <fa-icon [icon]="Save"></fa-icon> Guardando
                }
              </button>
            } @else {
              <button type="submit" [disabled]="form.invalid || isSaving" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
                @if (isSaving) {
                  <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Agregando...
                } @else {
                  <fa-icon [icon]="Add"></fa-icon> Agregar
                }
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class AreaModalComponent {
  @Input() area: Area | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private areasService = inject(AreaService);
  isSaving = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
  });

  // Icons
  Add = faPlus;
  Save = faFloppyDisk;

  ngOnInit() {
    if (this.area) {
      this.form.patchValue(this.area);
    }
  }

  save() {
    if (this.form.invalid) return;

    this.isSaving = true;
    const area = this.form.value as Area;

    if (this.area?.id) {
      this.areasService.updateArea(this.area.id, area).then(() => this.close.emit());
    } else {
      this.areasService.addArea(area).then(() => {
        this.isSaving = false;
        this.close.emit();
      });
    }
  }
}