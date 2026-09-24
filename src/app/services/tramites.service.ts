import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Tramite } from '../interfaces/tramite';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TramitesService {
  private firestore = inject(Firestore);
  private currentUser = inject(AuthService).usuarioLogged;
  private tramitesCollection = collection(this.firestore, 'tramites');

  private _tramitesRecibidos = signal<Tramite[]>([]);
  private _tramitesEnviados = signal<Tramite[]>([]);
  private _tramitesIniciados = signal<Tramite[]>([]);
  public tramitesRecibidos = this._tramitesRecibidos.asReadonly();
  public tramitesEnviados = this._tramitesEnviados.asReadonly();
  public tramitesIniciados = this._tramitesIniciados.asReadonly();

  public getTramitesRecibidos() {
    const queryRecibidos = query(this.tramitesCollection, where('dependenciaActual', '==', this.currentUser()!.dependenciaId));
    collectionData(queryRecibidos, { idField: 'id' }).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => (this._tramitesRecibidos.set(data as Tramite[])),
      error: (err) => (console.error('Error cargando recibidos', err)),
    });
  }

  public getTramitesEnviados() {
    const queryEnviados = query(this.tramitesCollection, where('dependenciasInvolucradas', 'array-contains', this.currentUser()!.dependenciaId));
    collectionData(queryEnviados, { idField: 'id' }).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        const enviados = (data as Tramite[]).filter(t => t.dependenciaActual !== this.currentUser()!.dependenciaId);
        this._tramitesEnviados.set(enviados);
      },
      error: (err) => (console.error('Error cargando enviados', err)),
    });
  }

  public getTramitesIniciados() {
    const queryIniciados = query(this.tramitesCollection, where('dependenciaOrigen', '==', this.currentUser()!.dependenciaId));
    collectionData(queryIniciados, { idField: 'id' }).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => (this._tramitesIniciados.set(data as Tramite[])),
      error: (err) => (console.error('Error cargando iniciados', err)),
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