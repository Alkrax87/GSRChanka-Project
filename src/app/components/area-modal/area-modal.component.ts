import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaService } from '../../services/area.service';
import { Area } from '../../interfaces/area';

@Component({
  selector: 'app-area-modal',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card w-96">
        <h2 class="card-title">{{ area ? 'Editar Área' : 'Crear Área' }}</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="flex flex-col gap-4">
            <!-- Nombre -->
            <div>
              <label for="nombre" class="relative">
                <input id="nombre" type="text" formControlName="nombre" placeholder="" class="input peer cursor-text"/>
                <span class="input-base-label">Nombre</span>
              </label>
            </div>
            <!-- Botones -->
            <div class="flex justify-end gap-2">
              <button type="button" (click)="close.emit()" [disabled]="isSaving" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">Cancelar</button>
              @if (area) {
                <button type="submit" [disabled]="form.invalid || isSaving" class="bg-yellow-500 hover:bg-yellow-500/80 text-white flex items-center gap-2 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isSaving) {
                    <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Guardando...
                  } @else {
                    <fa-icon [icon]="Save"></fa-icon> Guardar
                  }
                </button>
              } @else {
                <button type="submit" [disabled]="form.invalid || isSaving" class="bg-green-600 hover:bg-green-600/80 text-white flex items-center gap-2 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isSaving) {
                    <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Agregando...
                  } @else {
                    <fa-icon [icon]="Add"></fa-icon> Agregar
                  }
                </button>
              }
            </div>
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
    usuarios: [0, Validators.required],
    documentos: this.fb.group({
      contador: [0, Validators.required],
      total: [0, Validators.required],
    }),
  });

  // Icons
  Add = faPlus;
  Save = faFloppyDisk;

  ngOnInit() {
    if (this.area) {
      this.form.patchValue(this.area);
    }
  }

  onSubmit() {
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