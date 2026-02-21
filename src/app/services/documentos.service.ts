import { effect, inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Documento } from '../interfaces/documento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  documentosCollection = collection(this.firestore, 'documentos');

  private _documentos = signal<Documento[]>([]);
  public documentos = this._documentos.asReadonly();

  constructor() {
    this.getDocumentos();
  }

  private getDocumentos() {
    effect(() => {
      const user = this.authService.usuarioLogged();

      if (!user?.areaId) {
        this._documentos.set([]);
        return;
      }

      const queryDocumentos = query(this.documentosCollection, where('adjuntadoPorArea', '==', user?.areaId));

      (collectionData(queryDocumentos, { idField: 'id' }) as Observable<Documento[]>).subscribe({
        next: (data) => this._documentos.set(data),
        error: (err) => console.error('Error cargando documentos', err),
      });
    });
  }

  public addDocumento(documento: Documento) {
    return addDoc(this.documentosCollection, documento);
  }

  public updateDocumento(id: string, documento: Partial<Documento>) {
    const documentoDoc = doc(this.firestore, `documentos/${id}`);
    return updateDoc(documentoDoc, documento);
  }

  public deleteDocumento(id: string) {
    const documentoDoc = doc(this.firestore, `documentos/${id}`);
    return deleteDoc(documentoDoc);
  }
}