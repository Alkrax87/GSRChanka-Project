import { computed, inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Documento } from '../interfaces/documento';
import { AuthService } from './auth.service';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private authService = inject(AuthService);
  private documentosCollection = collection(this.firestore, 'documentos');

  private areaId = computed(() => this.authService.usuarioLogged()?.areaId || null);

  private documentos$ = toObservable(this.areaId).pipe(
    switchMap((areaId) => {
      if (!areaId) return of([] as Documento[]);

      const queryDocumentos = query(this.documentosCollection, where('adjuntadoPorArea', '==', areaId));
      return collectionData(queryDocumentos, { idField: 'id' }) as Observable<Documento[]>;
    })
  )
  public documentos = toSignal(this.documentos$, { initialValue: [] as Documento[] });

  async uploadFile(File: File, areaId: string): Promise<{ nombreArchivo: string; ruta: string; url: string; formato: string; peso: number; fecha: Date }> {
    const filePath = `documentos/${areaId}/${Date.now()}_${File.name}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, File);

    const url = await getDownloadURL(storageRef);

    return {
      nombreArchivo: File.name,
      ruta: filePath,
      url,
      formato: File.type,
      peso: File.size,
      fecha: new Date(),
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    const storageRef = ref(this.storage, filePath);
    await deleteObject(storageRef);
  }

  public addDocumento(documento: Partial<Documento>) {
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