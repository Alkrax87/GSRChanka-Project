import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { Dependencia } from '../interfaces/dependencia';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class DependenciasService {
  private firestore = inject(Firestore);
  dependenciasCollection = collection(this.firestore, 'dependencias');

  private _dependencias = signal<Dependencia[]>([]);
  public dependencias = this._dependencias.asReadonly();

  constructor() {
    this.getDependencias();
  }

  public getDependencias() {
    (collectionData(this.dependenciasCollection, { idField: 'id' }) as Observable<Dependencia[]>).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => (this._dependencias.set(data)),
      error: (err) => console.error('Error cargando dependencias', err),
    });
  }

  public getDependencia(id: string) {
    const dependenciaDoc = doc(this.firestore, `dependencias/${id}`);
    return getDoc(dependenciaDoc);
  }

  public addDependencia(dependencia: Dependencia) {
    return addDoc(this.dependenciasCollection, dependencia);
  }

  public updateDependencia(id: string, dependencia: Partial<Dependencia>) {
    const dependenciaDoc = doc(this.firestore, `dependencias/${id}`);
    return updateDoc(dependenciaDoc, dependencia);
  }

  public deleteDependencia(id: string) {
    const dependenciaDoc = doc(this.firestore, `dependencias/${id}`);
    return deleteDoc(dependenciaDoc);
  }

  public changeTotal(id: string, change: number) {
    const dependenciaDoc = doc(this.firestore, `dependencias/${id}`);
    getDoc(dependenciaDoc).then((doc) => {
      if (doc.exists()) {
        this.updateDependencia(id, { total: doc.data()['total'] + change });
      }
    });
  }
}