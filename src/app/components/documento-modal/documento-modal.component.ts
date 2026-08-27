import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Documento } from '../../interfaces/documento';
import { DocumentosService } from '../../services/documentos.service';
import { AuthService } from '../../services/auth.service';
import { faArrowUpFromBracket, faFileLines, faFloppyDisk, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DecimalPipe } from '@angular/common';
import { DependenciasService } from '../../services/dependencias.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-documento-modal',
  imports: [ReactiveFormsModule, FaIconComponent, DecimalPipe],
  template: `
    <div class="modal">
      <div class="card-modal w-96">
        <div class="flex justify-between">
          <h2 class="card-title">{{ documento ? 'Editar Documento' : 'Nuevo Documento' }}</h2>
          <div class="flex items-center cursor-pointer hover:text-neutral-600" (click)="close.emit()">
            <fa-icon [icon]="X"></fa-icon>
          </div>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
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
            <fa-icon [icon]="Upload" size="3x" class="text-main/50 group-hover:text-main duration-300"></fa-icon>
            <div class="my-3">
              <p class="text-neutral-400 text-center text-sm">Formatos permitidos</p>
              <p class="text-neutral-500 text-center text-xs font-semibold">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX</p>
            </div>
            <div>
              <input (change)="onFileSelected($event)" type="file" id="hiddenFileInput" style="display: none;" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx">
              <label for="hiddenFileInput" class="bg-main/50 group-hover:bg-main px-6 py-2 rounded-full cursor-pointer text-white flex gap-2 shadow-md duration-300">Subir archivo</label>
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
          <!-- Options -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn-cancel">Cancelar</button>
            @if (documento) {
              <button type="submit" [disabled]="form.invalid || isSaving" class="btn-edit disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isSaving) { <span class="spin"></span>Guardando... } @else { <fa-icon [icon]="Save"></fa-icon>Guardar }
              </button>
            } @else {
              <button type="submit" [disabled]="(form.invalid || selectedFile === null) || isSaving" class="btn-add disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isSaving) { <span class="spin"></span>Agregando... } @else { <fa-icon [icon]="Add"></fa-icon>Agregar }
              </button>
            }
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
  private usuariosService = inject(UsuariosService);
  private dependenciasService = inject(DependenciasService);
  currentUser = inject(AuthService).usuarioLogged();
  isSaving = false;

  form = this.fb.group({
    asunto: ['', Validators.required],
    tipo: ['', Validators.required],
  });
  selectedFile: File | null = null;

  // Icons
  Upload = faArrowUpFromBracket;
  Document = faFileLines;
  Add = faPlus;
  Save = faFloppyDisk;
  X = faTimes;

  ngOnInit() {
    if (this.documento) {
      this.form.patchValue({
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

  async onSubmit() {
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

        archivoData = await this.documentosService.uploadFile(this.selectedFile, this.currentUser!.dependenciaId);
      }

      const formValues = this.form.value;

      if (this.documento) {
        const documentoEditado: Partial<Documento> = {
          codigo: this.documento.codigo!,
          asunto: formValues.asunto!,
          tipo: formValues.tipo!,
          adjuntadoPorDependencia: this.currentUser!.dependenciaId,
          fechaModificacion: new Date(),
          archivo: archivoData!
        };

        await this.documentosService.updateDocumento(this.documento.id!, documentoEditado);
      } else {
        const userData = await this.usuariosService.getUsuario(this.currentUser!.uid!);

        if (userData.exists()) {
          const documentoNuevo: Partial<Documento> = {
            codigo: 'INFORME N°' + (userData.data()['contador'] + 1).toString().padStart(4, '0') + '-' + new Date().getFullYear() + '/' + userData.data()['abreviatura'],
            asunto: formValues.asunto!,
            tipo: formValues.tipo!,
            adjuntadoPorDependencia: userData.data()['dependenciaId'],
            propietario: {
              persona: userData.data()['nombres'] + ' ' + userData.data()['apellidos'],
              ownerId: this.currentUser!.uid!
            },
            fechaModificacion: new Date(),
            archivo: archivoData!,
          };
          this.dependenciasService.changeTotal(this.currentUser!.dependenciaId, +1);
          this.usuariosService.changeCounter(this.currentUser!.uid!, +1);

          await this.documentosService.addDocumento(documentoNuevo);
        } else {
          alert('Hubo un error al guardar el documento y el archivo.');
          return;
        }
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
