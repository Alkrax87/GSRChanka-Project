import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dependencia } from '../../interfaces/dependencia';
import { DependenciasService } from '../../services/dependencias.service';

@Component({
  selector: 'app-dependencia-modal',
  imports: [ReactiveFormsModule, FaIconComponent],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          @if (dependencia) {
            <h2 class="card-title">{{ isArea ? 'Editar Área' : 'Editar Obra' }}</h2>
          } @else {
            <h2 class="card-title">{{ isArea ? 'Nueva Área' : 'Nueva Obra' }}</h2>
          }
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <!-- Nombre -->
          <div>
            <label for="nombre" class="relative">
              <input id="nombre" type="text" formControlName="nombre" placeholder="" class="input peer cursor-text"/>
              <span class="input-base-label">Nombre</span>
            </label>
          </div>
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            @if (dependencia) {
              <button type="submit" [disabled]="form.invalid || isSaving" class="btn-edit disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isSaving) { <span class="spin"></span>Guardando... } @else { <fa-icon [icon]="Save"></fa-icon>Guardar }
              </button>
            } @else {
              <button type="submit" [disabled]="form.invalid || isSaving" class="btn-add disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isSaving) { <span class="spin"></span> Agregando... } @else { <fa-icon [icon]="Add"></fa-icon>Agregar }
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class DependenciaModalComponent {
  @Input() dependencia: Dependencia | null = null;
  @Input() isArea!: boolean;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private dependenciasService = inject(DependenciasService);
  isSaving = false;

  form = this.fb.group({
    nombre: ['', Validators.required],
    usuarios: [0, Validators.required],
    esArea: [false, Validators.required],
    total: [0, Validators.required],
  });

  // Icons
  Add = faPlus;
  Save = faFloppyDisk;
  X = faTimes;

  ngOnInit() {
    this.form.patchValue({ esArea: this.isArea });

    if (this.dependencia) {
      this.form.patchValue(this.dependencia);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      const dependenciaForm = this.form.value as Dependencia;

      if (this.dependencia?.id) {
        this.dependenciasService.updateDependencia(this.dependencia.id, dependenciaForm).then(() => this.close.emit());
      } else {
        this.dependenciasService.addDependencia(dependenciaForm).then(() => {
          this.isSaving = false;
          this.close.emit();
        });
      }
    } else {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }
  }
}