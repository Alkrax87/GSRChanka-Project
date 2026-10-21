import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowUpFromBracket, faFileLines, faFloppyDisk, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ArchivoRepositorio } from '../../interfaces/archivo-repositorio';
import { AuthService } from '../../services/auth.service';
import { RepositorioDigitalService } from '../../services/repositorio-digital.service';

@Component({
  selector: 'app-archivo-repositorio-modal',
  imports: [ReactiveFormsModule, FaIconComponent, DecimalPipe],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">{{ archivo ? 'Editar archivo' : 'Agregar al repositorio' }}</h2>
          <button type="button" (click)="close.emit()" class="text-neutral-500 hover:text-neutral-700">
            <fa-icon [icon]="X"></fa-icon>
          </button>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
          <!-- Nombre -->
          <div>
            <label for="nombre" class="relative">
              <input id="nombre" type="text" formControlName="nombre" placeholder=" " class="input peer">
              <span class="input-base-label">Nombre</span>
            </label>
          </div>
          <!-- Archivo -->
          <label for="archivo" class="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-200 p-4 transition hover:border-main">
            <fa-icon [icon]="Upload" size="2x" class="text-main/60"></fa-icon>
            <span class="mt-3 text-sm font-semibold text-neutral-600">Seleccionar archivo</span>
            <span class="mt-1 text-xs text-neutral-400">Se admiten distintos tipos de archivo</span>
            <input id="archivo" type="file" class="sr-only" (change)="onFileSelected($event)">
          </label>
          @if (selectedFile || archivo) {
            <div class="flex min-w-0 items-center gap-3 rounded-xl border border-neutral-100 p-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-main/10 text-main"><fa-icon [icon]="Document"></fa-icon></span>
              <div class="min-w-0">
                <p class="truncate text-xs font-semibold text-neutral-700">{{ selectedFile?.name || archivo?.archivo?.nombreArchivo }}</p>
                <p class="text-xs text-neutral-500">{{ ((selectedFile?.size ?? archivo?.archivo?.peso ?? 0) / 1024 / 1024) | number:'1.2-2' }} MB</p>
              </div>
            </div>
          }
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || (!archivo && !selectedFile) || isSaving" class="btn-add disabled:cursor-not-allowed disabled:opacity-50">
              @if (isSaving) { <span class="spin"></span>Guardando... }
              @else { <fa-icon [icon]="archivo ? Save : Add"></fa-icon>{{ archivo ? 'Guardar' : 'Agregar' }} }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class ArchivoRepositorioModalComponent {
  @Input() archivo: ArchivoRepositorio | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private repositorioService = inject(RepositorioDigitalService);
  private currentUser = inject(AuthService).usuarioLogged;
  form = this.fb.group({ nombre: ['', Validators.required] });
  selectedFile: File | null = null;
  isSaving = false;

  Upload = faArrowUpFromBracket;
  Document = faFileLines;
  Save = faFloppyDisk;
  Add = faPlus;
  X = faTimes;

  ngOnInit() {
    if (this.archivo) this.form.patchValue({ nombre: this.archivo.nombre });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  async onSubmit() {
    if (this.form.invalid || this.isSaving || (!this.archivo && !this.selectedFile)) return;
    const user = this.currentUser();
    if (!user?.dependenciaId || !user.uid) {
      alert('No se pudo identificar la dependencia del usuario.');
      return;
    }

    this.isSaving = true;
    let uploadedFile: ArchivoRepositorio['archivo'] | null = null;
    try {
      if (this.selectedFile) uploadedFile = await this.repositorioService.uploadFile(this.selectedFile, user.dependenciaId);
      const now = new Date();
      const nombre = this.form.controls.nombre.value!.trim();
      const actor = { uid: user.uid, nombre: user.displayName };

      if (this.archivo?.id) {
        await this.repositorioService.updateArchivo(this.archivo.id, {
          nombre,
          fechaModificacion: now,
          modificadoPor: actor,
          ...(uploadedFile ? { archivo: uploadedFile } : {}),
        });
        if (uploadedFile && this.archivo.archivo.ruta) {
          await this.repositorioService.deleteFile(this.archivo.archivo.ruta).catch(error => console.error('No se pudo eliminar el archivo reemplazado', error));
        }
      } else {
        await this.repositorioService.addArchivo({
          nombre,
          dependenciaId: user.dependenciaId,
          fechaCreacion: now,
          fechaModificacion: now,
          creadoPor: actor,
          modificadoPor: actor,
          archivo: uploadedFile!,
        });
      }
      this.close.emit();
    } catch (error) {
      if (uploadedFile) await this.repositorioService.deleteFile(uploadedFile.ruta).catch(cleanupError => console.error('No se pudo limpiar el archivo subido', cleanupError));
      console.error('Error guardando en el repositorio digital:', error);
      alert(error instanceof Error ? error.message : 'No se pudo guardar el archivo.');
    } finally {
      this.isSaving = false;
    }
  }
}
