import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tramite } from '../interfaces/tramite';

@Injectable({
  providedIn: 'root',
})
export class TramitesService {
  private firestore = inject(Firestore);
  tramitesCollection = collection(this.firestore, 'tramites');

  getTramites(area: string) {
    const queryTramites = query(this.tramitesCollection, where('ubicacionActual.area', '==', area));
    return collectionData(queryTramites, { idField: 'id' }) as Observable<Tramite[]>;
  }

  addTramite(tramite: Tramite) {
    return addDoc(this.tramitesCollection, tramite);
  }

  updateTramite(id: string, tramite: Partial<Tramite>) {
    const tramiteDoc = doc(this.firestore, `tramites/${id}`);
    return updateDoc(tramiteDoc, tramite);
  }

  deleteTramite(id: string) {
    const tramiteDoc = doc(this.firestore, `tramites/${id}`);
    return deleteDoc(tramiteDoc);
  }
}
