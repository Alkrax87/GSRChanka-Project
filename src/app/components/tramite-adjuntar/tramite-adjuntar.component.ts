import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Documento, Tramite } from '../../interfaces/tramite';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TramitesService } from '../../services/tramites.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudUploadAlt, faFileCirclePlus, faFileLines, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tramite-adjuntar',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
        <h2 class="text-xl font-semibold">Gestión de Documentos</h2>
        <div class="flex items-center justify-between">
          <div class="flex gap-2 text-sm">
            <span class="text-neutral-500">Documentos:</span>
            <span class="font-bold text-main">{{ documentsArray.length }}</span>
          </div>
          <button (click)="addDocument()" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full">
            <fa-icon [icon]="FileAdd"></fa-icon> Agregar
          </button>
        </div>
        <form [formGroup]="form" (ngSubmit)="save()" class="mt-4">
          <div formArrayName="documentos">
            @if (documentsArray.length === 0) {
              <div class="h-[134px] border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400">
                <fa-icon [icon]="Document" size="2x" class="mb-2 opacity-50"></fa-icon>
                <p>No hay documentos adjuntos.</p>
              </div>
            } @else {
              <div class="flex flex-col gap-1">
                @for (control of documentsArray.controls; track $index) {
                  <div [formGroupName]="$index" class="h-[134px] p-4 border-2 border-dashed border-main rounded-2xl">
                    <!-- Titulo -->
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-xs font-semibold text-main uppercase">Documento #{{ $index + 1 }}</span>
                      <button type="button" (click)="deleteDocument($index)" class="text-red-600"><fa-icon [icon]="Delete"></fa-icon></button>
                    </div>
                    <!-- Contenedor de archivos -->
                    <div class="flex justify-between gap-x-2 gap-y-0 items-end">
                      <!-- Documentos -->
                      <div class="flex gap-2 items-center h-full">
                        <label [for]="'hiddenFileInput' + $index" class="block text-xs font-medium text-neutral-600 mb-1">Archivo</label>
                        <div>
                          <input (change)="onFileSelected($event, $index)" type="file" [id]="'hiddenFileInput' + $index" style="display: none;">
                          <label [for]="'hiddenFileInput' + $index" class="bg-main hover:bg-main-hover px-4 py-2 my-1 rounded-full cursor-pointer text-white flex gap-4">
                            <fa-icon [icon]="Document"></fa-icon> Subir archivo
                          </label>
                        </div>
                      </div>
                      <!-- Tipo -->
                      <div>
                        <label for="tipo" class="relative">
                          <select id="tipo" formControlName="tipo" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full text-sm shadow-sm duration-100 outline-none">
                            <div class="rounded-lg overflow-hidden">
                              <option value="" disabled selected>Seleccionar</option>
                              <option value="Revisión">Revisión</option>
                              <option value="Oficio">Oficio</option>
                              <option value="Documento">Documento</option>
                              <option value="TdR">TdR</option>
                              <option value="Otro">Otro</option>
                            </div>
                          </select>
                          <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Tipo</span>
                        </label>
                      </div>
                    </div>
                    <!-- Estado de archivo -->
                    <div class="">
                      @if (getGroup($index).get('nombre')?.value) {
                        <p class="text-green-600 text-xs truncate">✓ Archivo adjunto: {{ getGroup($index).get('nombre')?.value }}</p>
                      } @else {
                        <p class="text-red-600 text-xs truncate">✗ Sin archivo adjunto</p>
                      }
                    </div>
                  </div>
                }
              </div>
            }
          </div>
          <!-- Botones -->
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
            <button type="submit" [disabled]="form.invalid || isSaving" class="bg-main hover:bg-main-hover px-4 py-2 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4">
              @if (isSaving) {
                <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> Guardando...
              } @else {
                <fa-icon [icon]="Save"></fa-icon> Guardar Cambios
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class TramiteAdjuntarComponent {
  @Input() tramite: Tramite | null = null;
  @Input() currentArea!: string;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private tramitesService = inject(TramitesService);

  selectedFiles = new Map<number, File>();
  isSaving = false;

  form = this.fb.group({
    documentos: this.fb.array<FormGroup>([])
  });

  // Icons
  Document = faFileLines;
  FileAdd = faFileCirclePlus;
  Delete = faTrash;
  Save = faSave;
  Upload = faCloudUploadAlt;

  ngOnInit() {
    if (this.tramite?.documentos?.length) {
      this.tramite.documentos.forEach(doc => {
        this.documentsArray.push(this.createDocumentGroup(doc));
      });
    }
  }

  // Crear un formGoup de documento
  createDocumentGroup(doc?: Documento) {
    return this.fb.group({
      id: [doc?.id ?? crypto.randomUUID()],
      nombre: [doc?.nombre ?? '', Validators.required],
      tipo: [doc?.tipo ?? '', Validators.required],
      adjuntadoPorArea: [doc?.adjuntadoPorArea ?? this.currentArea],
      estado: [doc?.estado ?? 'Pendiente'],
      rutaArchivo: [doc?.rutaArchivo ?? ''],
    });
  }

  // Obtener los documentos adjuntos del trámite
  get documentsArray() {
    return this.form.get('documentos') as FormArray;
  }

  // Agregar un card
  addDocument() {
    this.documentsArray.push(this.createDocumentGroup());
  }

  // Eliminar un card
  deleteDocument(index: number) {
    this.documentsArray.removeAt(index);
    this.selectedFiles.delete(index);
  }

  // Helper para obtener el control como FormGroup en el template
  getGroup(index: number): FormGroup {
    return this.documentsArray.at(index) as FormGroup;
  }

  /**
   * Maneja la selección del archivo.
   * 1. Guarda el archivo en el Map.
   * 2. Rellena el campo "nombre" con el nombre del archivo automáticamente.
   */
  onFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.selectedFiles.set(index, file);

      const currentControl = this.getGroup(index);
      currentControl.patchValue({ nombre: file.name });
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    try {
      const uploadPromises = Array.from(this.selectedFiles.entries()).map(async ([index, file]) => {
        // const url = await this.storageService.upload(file);

        // Simulación de URL
        const mockUrl = `https://storage.fake.com/${file.name}`;

        // Actualizamos el form control con la URL
        this.getGroup(index).patchValue({ rutaArchivo: mockUrl });
      });

      await Promise.all(uploadPromises);

      const documentosValues = this.form.value.documentos as Documento[];

      if (this.tramite?.id) {
        this.tramite.documentos = documentosValues;
        await this.tramitesService.updateTramite(this.tramite.id, this.tramite);
        this.close.emit();
      }
    } catch (error) {
      console.error('Error guardando documentos', error);
    } finally {
      this.isSaving = false;
    }
  }
}