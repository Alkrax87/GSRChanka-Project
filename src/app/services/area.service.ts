import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Area } from '../interfaces/area';


@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private firestore = inject(Firestore);
  areasCollection = collection(this.firestore, 'areas');

  getAreas(): Observable<Area[]> {
    return collectionData(this.areasCollection, { idField: 'id' }) as Observable<Area[]>;
  }

  addArea(area: Area) {
    return addDoc(this.areasCollection, area);
  }

  updateArea(id: string, area: Partial<Area>) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return updateDoc(areaDoc, area);
  }

  deleteArea(id: string) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return deleteDoc(areaDoc);
  }
}