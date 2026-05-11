import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Inversion } from '../interfaces/inversion';
@Injectable({
  providedIn: 'root'
})
export class InversionService {

  private firestore = inject(Firestore);
  inversionCollection = collection(this.firestore, 'inversion');

  getInversion(): Observable<Inversion[]> {
    return collectionData(this.inversionCollection, { idField: 'id' }) as Observable<Inversion[]>;
  }

  addInversion(inversion: Inversion) {
    return addDoc(this.inversionCollection, inversion);
  }

  updateInversion(id: string, inversion: Partial<Inversion>) {
    const inversionDoc = doc(this.firestore, `inversion/${id}`);
    return updateDoc(inversionDoc, inversion);
  }

  deleteInversion(id: string) {
    const inversionDoc = doc(this.firestore, `inversion/${id}`);
    return deleteDoc(inversionDoc);
  }

}
