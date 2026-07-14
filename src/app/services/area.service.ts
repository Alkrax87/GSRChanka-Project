import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Area } from '../interfaces/area';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private firestore = inject(Firestore);
  areasCollection = collection(this.firestore, 'areas');

  private _areas = signal<Area[]>([]);
  public areas = this._areas.asReadonly();

  constructor() {
    this.getAreas();
  }

  private getAreas() {
    (collectionData(this.areasCollection, { idField: 'id' }) as Observable<Area[]>).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this._areas.set(data),
      error: (err) => console.error('Error cargando áreas', err),
    });
  }

  public getArea(id: string) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return getDoc(areaDoc);
  }

  public addArea(area: Area) {
    return addDoc(this.areasCollection, area);
  }

  public updateArea(id: string, area: Partial<Area>) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return updateDoc(areaDoc, area);
  }

  public deleteArea(id: string) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return deleteDoc(areaDoc);
  }

  public changeTotal(id: string, change: number) {
    const areaDoc = doc(this.firestore, `areas/${id}`);

    getDoc(areaDoc).then((doc) => {
      if (doc.exists()) {
        this.updateArea(id, {
          documentos: {
            contador: doc.data()['documentos'].contador,
            total: doc.data()['documentos'].total + change,
          },
        });
      }
    });
  }
}