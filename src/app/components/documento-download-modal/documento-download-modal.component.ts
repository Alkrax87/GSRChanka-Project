import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Documento } from '../../interfaces/documento';
import { faDownload, faFile } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-documento-download-modal',
  imports: [FaIconComponent, DecimalPipe],
  template: `
    <div class="modal">
      <div class="card w-96">
        <h2 class="card-title">Descargar Documento</h2>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2 border p-2 rounded-lg border-dashed">
            <div class="h-10 w-10 flex items-center justify-center bg-main/10 rounded-lg">
              <fa-icon [icon]="Document" class="text-main text-2xl mb-1"></fa-icon>
            </div>
            <div class="flex flex-col justify-center truncate">
              <p class="text-xs truncate font-semibold text-neutral-600">{{ documento.archivo.nombreArchivo }}</p>
              <p class="text-xs text-muted-foreground text-neutral-500">{{ documento.archivo!.peso / 1024 / 1024 | number:'1.2-2' }} MB</p>
            </div>
          </div>
          <!-- Botones -->
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="btn bg-neutral-100 hover:bg-neutral-200/75">Cancelar</button>
            <a target="_blank" [href]="documento.archivo.url" (click)="close.emit()" class="btn bg-sky-600 hover:bg-sky-600/75 text-white cursor-pointer">
              <fa-icon [icon]="Download"></fa-icon> Descargar
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class DocumentoDownloadModalComponent {
  @Input() documento!: Documento;
  @Output() close = new EventEmitter<void>();

  Download = faDownload;
  Document = faFile;
}
