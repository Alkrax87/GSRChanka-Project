import { effect, inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tramite } from '../interfaces/tramite';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TramitesService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  tramitesCollection = collection(this.firestore, 'tramites');

  private _tramites = signal<Tramite[]>([]);
  public tramites = this._tramites.asReadonly();

  constructor() {
    this.listenUserArea();
  }

  private listenUserArea() {
    effect(() => {
      const user = this.authService.usuarioLogged();

      if (!user?.areaId) {
        this._tramites.set([]);
        return;
      }

      const queryTramites = query(this.tramitesCollection, where('areaActual', '==', user.areaId));

      (collectionData(queryTramites, { idField: 'id' }) as Observable<Tramite[]>).subscribe({
        next: (data) => this._tramites.set(data),
        error: (err) => console.error('Error cargando trámites', err),
      });
    });
  }

  public addTramite(tramite: Tramite) {
    return addDoc(this.tramitesCollection, tramite);
  }

  public updateTramite(id: string, tramite: Partial<Tramite>) {
    const tramiteDoc = doc(this.firestore, `tramites/${id}`);
    return updateDoc(tramiteDoc, tramite);
  }

  public deleteTramite(id: string) {
    const tramiteDoc = doc(this.firestore, `tramites/${id}`);
    return deleteDoc(tramiteDoc);
  }
}