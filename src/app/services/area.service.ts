import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, CollectionReference, docData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

export interface Area {
  id?: string;
  nombre: string;
  responsable: string;
}

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private areasCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.areasCollection = collection(this.firestore, 'areas');
  }

  getAreas(): Observable<Area[]> {
 return collectionData(this.areasCollection, { idField: 'id' }) as Observable<Area[]>;
}

  addArea(area: Area) {
    return addDoc(this.areasCollection, area);
  }

  deleteArea(id: string) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return deleteDoc(areaDoc);
  }

  updateArea(id: string, area: Partial<Area>) {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return updateDoc(areaDoc, area);
  }
  getAreaById(id: string): Observable<Area> {
    const areaDoc = doc(this.firestore, `areas/${id}`);
    return docData(areaDoc, { idField: 'id' }) as Observable<Area>;
  }
}