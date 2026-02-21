import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Documento } from '../../interfaces/documento';
import { DocumentosService } from '../../services/documentos.service';
import { AuthService } from '../../services/auth.service';
import { faFile, faFileLines, faFloppyDisk, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-documento-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 class="text-xl font-semibold">{{ documento ? 'Editar Documento' : 'Agregar Documento' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4 my-4">
            <!-- Código -->
            <div>
              <label for="codigo" class="relative">
                <input id="codigo" type="text" formControlName="codigo" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Código</span>
              </label>
            </div>
            <!-- Tipo -->
            <div>
              <label for="tipo" class="relative">
                <select id="tipo" formControlName="tipo" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="" disabled>Selecciona tipo</option>
                  <option value="Informe">Informe</option>
                  <option value="Revisión">Revisión</option>
                  <option value="Oficio">Oficio</option>
                  <option value="Expediente">Expediente</option>
                  <option value="TdR">TdR</option>
                  <option value="Documento">Documento</option>
                  <option value="Presentación">Presentación</option>
                  <option value="Otro">Otro</option>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Tipo</span>
              </label>
            </div>
            <!-- Archivo -->
            <div>
              <div class="flex gap-2 items-center mb-4">
                <!-- Button -->
                <div>
                  <input (change)="onFileSelected($event)" type="file" id="hiddenFileInput" style="display: none;" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
                  <label for="hiddenFileInput" class="bg-main hover:bg-main-hover px-4 py-2 rounded-full cursor-pointer text-white flex gap-2">
                    <fa-icon [icon]="Upload"></fa-icon> Subir archivo
                  </label>
                </div>
                <!-- Estado de archivo -->
                <div class="">
                  @if (selectedFile || documento?.archivo?.nombreArchivo) {
                    <p class="text-green-600 text-xs truncate">✓ Archivo adjunto</p>
                  } @else {
                    <p class="text-red-600 text-xs truncate">✗ Sin archivo adjunto</p>
                  }
                </div>
              </div>
              @if (selectedFile || documento?.archivo?.nombreArchivo) {
                <div class="h-24 border-2 border-dashed border-main rounded-2xl flex flex-col items-center justify-center text-main">
                  <fa-icon [icon]="Document" size="2x" class="mb-1"></fa-icon>
                  @if (selectedFile) {
                    <p class="text-sm">{{ selectedFile.name }}</p>
                  } @else {
                    <p class="text-sm">{{ documento?.archivo?.nombreArchivo }}</p>
                  }
                </div>
              } @else {
                <div class="h-24 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400">
                  <fa-icon [icon]="Document" size="2x" class="mb-1"></fa-icon>
                  <p class="text-sm">No hay ningún archivo adjunto.</p>
                </div>
              }
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" (click)="close.emit()" class="bg-neutral-100 hover:bg-neutral-200/75 px-4 py-2 rounded-full">Cancelar</button>
              @if (documento) {
                <button type="submit" [disabled]="form.invalid || isSaving" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
                  @if (isSaving) {
                    <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Guardando...
                  } @else {
                    <fa-icon [icon]="Save"></fa-icon> Guardar
                  }
                </button>
              } @else {
                <button type="submit" [disabled]="(form.invalid || selectedFile === null) || isSaving" class="bg-main hover:bg-main-hover text-white flex items-center gap-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
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
export class DocumentoModalComponent {
  @Input() documento: Documento | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private documentosService = inject(DocumentosService);
  currentArea = inject(AuthService).usuarioLogged()!.areaId;
  isSaving = false;

  form = this.fb.group({
    codigo: ['', Validators.required],
    tipo: ['', Validators.required],
  });
  selectedFile: File | null = null;

  // Icons
  Upload = faUpload;
  Document = faFileLines;
  Add = faPlus;
  Save = faFloppyDisk;

  ngOnInit() {
    if (this.documento) {
      this.form.patchValue(this.documento);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedFile = null;
      return;
    }

    this.selectedFile = input.files[0];
  }

  private mockUploadToStorage(file: File) {
    return {
      nombreArchivo: file.name,
      ruta: `documentos/${this.currentArea}/${file.name}`,
      url: `https://fake-storage.firebase/${this.currentArea}/${file.name}`,
      formato: file.type,
      peso: file.size,
      fecha: new Date(),
    }
  }

  save() {
    if (this.form.invalid) return;

    if (!this.documento && !this.selectedFile) {
      alert('Debes seleccionar un archivo para crear un documento nuevo.');
      return;
    }

    this.isSaving = true;

    let archivo;
    if (this.documento && this.selectedFile === null) {
      archivo = this.documento.archivo;
    } else {
      archivo = this.mockUploadToStorage(this.selectedFile!);
    }

    const documentoObject = {
      codigo: this.form.value.codigo!,
      tipo: this.form.value.tipo!,
      adjuntadoPorArea: this.currentArea,
      archivo: archivo
    }

    if (this.documento?.id) {
      this.documentosService.updateDocumento(this.documento.id, documentoObject).then(() => this.close.emit());
    } else {
      this.documentosService.addDocumento(documentoObject).then(() => {
        this.isSaving = false;
        this.close.emit();
      });
    }
  }
}
