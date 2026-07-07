import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Documento } from '../../interfaces/documento';
import { DocumentosService } from '../../services/documentos.service';
import { AuthService } from '../../services/auth.service';
import { faArrowUpFromBracket, faFileLines, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-documento-modal',
  imports: [ReactiveFormsModule, FaIconComponent, DecimalPipe],
  template: `
    <div class="modal">
      <div class="card w-96">
        <h2 class="card-title">{{ documento ? 'Editar Documento' : 'Agregar Documento' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="flex flex-col gap-4">
            <!-- Código -->
            <div>
              <label for="codigo" class="relative">
                <input id="codigo" type="text" formControlName="codigo" placeholder="" class="input peer cursor-text">
                <span class="input-base-label">Código</span>
              </label>
            </div>
            <!-- Asunto -->
            <div>
              <label for="asunto" class="relative">
                <input id="asunto" type="text" formControlName="asunto" placeholder="" class="input peer cursor-text">
                <span class="input-base-label">Asunto</span>
              </label>
            </div>
            <!-- Tipo -->
            <div>
              <label for="tipo" class="relative">
                <select id="tipo" formControlName="tipo" class="input peer cursor-pointer" required>
                  <option value="" disabled selected hidden></option>
                  <option value="Informe">Informe</option>
                  <option value="Revisión">Revisión</option>
                  <option value="Oficio">Oficio</option>
                  <option value="Expediente">Expediente</option>
                  <option value="TdR">TdR</option>
                  <option value="Documento">Documento</option>
                  <option value="Presentación">Presentación</option>
                  <option value="Otro">Otro</option>
                </select>
                <span class="input-select-label">Tipo</span>
              </label>
            </div>
            <!-- Archivo -->
            <label for="hiddenFileInput" class="h-52 cursor-pointer border-2 border-dashed rounded-3xl flex flex-col items-center justify-center group hover:border-main duration-300">
              <fa-icon [icon]="Upload" size="3x" class="text-neutral-300 group-hover:text-main duration-300"></fa-icon>
              <div class="my-3">
                <p class="text-neutral-400 text-center text-sm">Formatos permitidos</p>
                <p class="text-neutral-500 text-center text-xs font-semibold">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</p>
              </div>
              <div>
                <input (change)="onFileSelected($event)" type="file" id="hiddenFileInput" style="display: none;" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
                <label for="hiddenFileInput" class="bg-main px-6 py-2 rounded-full cursor-pointer text-white flex gap-2 shadow-md">Subir archivo</label>
              </div>
            </label>
            <!-- File -->
            @if (selectedFile || documento?.archivo?.nombreArchivo) {
              <div class="flex gap-2">
                <div class="h-10 w-10 flex items-center justify-center bg-main/10 rounded-lg">
                  <fa-icon [icon]="Document" class="text-main text-2xl mb-1"></fa-icon>
                </div>
                <div class="flex flex-col justify-center truncate">
                  @if (selectedFile) {
                    <p class="text-xs truncate font-semibold text-neutral-600">{{ selectedFile.name }}</p>
                    <p class="text-xs text-muted-foreground text-neutral-500">{{ selectedFile.size / 1024 / 1024 | number:'1.2-2' }} MB</p>
                  } @else {
                    <p class="text-xs truncate font-semibold text-neutral-600">{{ documento?.archivo?.nombreArchivo }}</p>
                    <p class="text-xs text-muted-foreground text-neutral-500">{{ documento?.archivo!.peso / 1024 / 1024 | number:'1.2-2' }} MB</p>
                  }
                </div>
              </div>
            }
            <!-- Botones -->
            <div class="flex justify-end gap-2">
              <button type="button" (click)="close.emit()" class="btn bg-neutral-100 hover:bg-neutral-200/75">Cancelar</button>
              @if (documento) {
                <button type="submit" [disabled]="form.invalid || isSaving" class="btn bg-main hover:bg-main-hover text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isSaving) {
                    <span class="animate-spin h-4 min-w-4 border-2 border-white border-t-transparent rounded-full"></span> Guardando...
                  } @else {
                    <fa-icon [icon]="Save"></fa-icon> Guardar
                  }
                </button>
              } @else {
                <button type="submit" [disabled]="(form.invalid || selectedFile === null) || isSaving" class="btn bg-main hover:bg-main-hover text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full">
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
    asunto: ['', Validators.required],
    tipo: ['', Validators.required],
  });
  selectedFile: File | null = null;

  // Icons
  Upload = faArrowUpFromBracket;
  Document = faFileLines;
  Add = faPlus;
  Save = faFloppyDisk;

  ngOnInit() {
    if (this.documento) {
      this.form.patchValue({
        codigo: this.documento.codigo,
        asunto: this.documento.asunto,
        tipo: this.documento.tipo
      });
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

  async save() {
    if (this.form.invalid || this.isSaving) return;

    if (!this.documento && !this.selectedFile) {
      alert('Debes seleccionar un archivo para crear un documento nuevo.');
      return;
    }

    try {
      this.isSaving = true;
      let archivoData = this.documento?.archivo || null;

      if (this.selectedFile) {
        if (this.documento) {
          await this.documentosService.deleteFile(this.documento.archivo.ruta);
        }

        archivoData = await this.documentosService.uploadFile(this.selectedFile, this.currentArea);
      }

      const formValues = this.form.value;

      if (this.documento) {
        const documentoEditado: Partial<Documento> = {
          codigo: formValues.codigo!,
          asunto: formValues.asunto!,
          tipo: formValues.tipo!,
          adjuntadoPorArea: this.currentArea,
          fechaModificacion: new Date(),
          archivo: archivoData!
        };

        await this.documentosService.updateDocumento(this.documento.id!, documentoEditado);
      } else {
        const documentoNuevo: Partial<Documento> = {
          codigo: formValues.codigo!,
          asunto: formValues.asunto!,
          tipo: formValues.tipo!,
          adjuntadoPorArea: this.currentArea,
          fechaModificacion: new Date(),
          archivo: archivoData!,
        };

        await this.documentosService.addDocumento(documentoNuevo);
      }

      this.close.emit();
    } catch (error) {
      console.error('Error al procesar el documento:', error);
      alert('Hubo un error al guardar el documento y el archivo.');
    } finally {
      this.isSaving = false;
    }
  }
}
