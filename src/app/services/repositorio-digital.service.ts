import { computed, inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, of, switchMap } from 'rxjs';
import { ArchivoRepositorio } from '../interfaces/archivo-repositorio';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RepositorioDigitalService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private authService = inject(AuthService);
  private archivosCollection = collection(this.firestore, 'repositorioDigital');
  private dependenciaId = computed(() => this.authService.usuarioLogged()?.dependenciaId || null);

  private archivos$ = toObservable(this.dependenciaId).pipe(
    switchMap(dependenciaId => {
      if (!dependenciaId) return of([] as ArchivoRepositorio[]);
      const archivosQuery = query(this.archivosCollection, where('dependenciaId', '==', dependenciaId));
      return collectionData(archivosQuery, { idField: 'id' }) as Observable<ArchivoRepositorio[]>;
    }),
  );

  public archivos = toSignal(this.archivos$, { initialValue: [] as ArchivoRepositorio[] });

  async uploadFile(file: File, dependenciaId: string): Promise<ArchivoRepositorio['archivo']> {
    const path = `repositorioDigital/${dependenciaId}/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return {
      nombreArchivo: file.name,
      ruta: path,
      url,
      formato: file.type || 'application/octet-stream',
      peso: file.size,
    };
  }

  async addArchivo(archivo: ArchivoRepositorio): Promise<void> {
    await addDoc(this.archivosCollection, archivo);
  }

  async updateArchivo(id: string, cambios: Partial<ArchivoRepositorio>): Promise<void> {
    await updateDoc(doc(this.firestore, `repositorioDigital/${id}`), cambios);
  }

  async deleteArchivo(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `repositorioDigital/${id}`));
  }

  async deleteFile(path: string): Promise<void> {
    await deleteObject(ref(this.storage, path));
  }
}
