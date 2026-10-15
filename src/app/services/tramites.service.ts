import { computed, effect, inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, query, runTransaction, updateDoc, where } from '@angular/fire/firestore';
import { Tramite } from '../interfaces/tramite';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TramitesService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);
  private currentUser = inject(AuthService).usuarioLogged;
  private tramitesCollection = collection(this.firestore, 'tramites');

  private _tramitesRecibidos = signal<Tramite[]>([]);
  private _tramitesRelacionados = signal<Tramite[]>([]);
  private _tramitesEnviados = signal<Tramite[]>([]);
  private _tramitesIniciados = signal<Tramite[]>([]);
  public tramitesRecibidos = this._tramitesRecibidos.asReadonly();
  public tramitesRelacionados = this._tramitesRelacionados.asReadonly();
  public tramitesEnviados = this._tramitesEnviados.asReadonly();
  public tramitesIniciados = this._tramitesIniciados.asReadonly();
  public tramitesRecibidosNoVistos = computed(() =>
    this._tramitesRecibidos().filter(tramite => tramite.trazabilidad?.[0]?.fechaRecepcion == null),
  );

  constructor() {
    effect((onCleanup) => {
      const dependenciaId = this.currentUser()?.dependenciaId;
      if (!dependenciaId) {
        this._tramitesRecibidos.set([]);
        this._tramitesRelacionados.set([]);
        return;
      }

      const subscription = runInInjectionContext(this.injector, () => {
        const queryRecibidos = query(this.tramitesCollection, where('dependenciaActual', '==', dependenciaId), where('estadoActual', 'in', ['Pendiente' ,'En Proceso' ,'Devuelto']));
        return collectionData(queryRecibidos, { idField: 'id' }).subscribe({
          next: (data) => this._tramitesRecibidos.set(data as Tramite[]),
          error: (err) => console.error('Error cargando recibidos', err),
        });
      });

      const relatedSubscription = runInInjectionContext(this.injector, () => {
        const queryRelacionados = query(this.tramitesCollection, where('dependenciasInvolucradas', 'array-contains', dependenciaId));
        return collectionData(queryRelacionados, { idField: 'id' }).subscribe({
          next: (data) => this._tramitesRelacionados.set(data as Tramite[]),
          error: (err) => console.error('Error cargando trámites relacionados', err),
        });
      });

      onCleanup(() => {
        subscription.unsubscribe();
        relatedSubscription.unsubscribe();
      });
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

  public async iniciarTramiteConDocumento(tramite: Tramite, documentoId: string) {
    const documentoRef = doc(this.firestore, `documentos/${documentoId}`);
    const tramiteRef = doc(this.tramitesCollection);

    await runTransaction(this.firestore, async (transaction) => {
      const documentoSnapshot = await transaction.get(documentoRef);
      if (!documentoSnapshot.exists()) throw new Error('El documento ya no existe.');

      const documento = documentoSnapshot.data();
      if (documento['enTramite'] || documento['enExpediente']) {
        throw new Error('Este documento ya está asociado a un trámite o expediente.');
      }

      transaction.set(tramiteRef, tramite);
      transaction.update(documentoRef, { enTramite: true });
    });
  }

  public async adjuntarDocumento(tramiteId: string, documentoId: string) {
    const tramiteRef = doc(this.firestore, `tramites/${tramiteId}`);
    const documentoRef = doc(this.firestore, `documentos/${documentoId}`);

    await runTransaction(this.firestore, async (transaction) => {
      const [tramiteSnapshot, documentoSnapshot] = await Promise.all([transaction.get(tramiteRef), transaction.get(documentoRef)]);
      if (!tramiteSnapshot.exists()) throw new Error('El trámite ya no existe.');
      if (!documentoSnapshot.exists()) throw new Error('El documento ya no existe.');

      const tramite = tramiteSnapshot.data() as Tramite;
      const documento = documentoSnapshot.data();
      if (tramite.estadoActual === 'Finalizado') throw new Error('No se pueden adjuntar documentos a un trámite finalizado.');
      if (documento['enTramite'] || documento['enExpediente']) {
        throw new Error('Este documento ya está asociado a un trámite o expediente.');
      }
      if (tramite.documentosAdjuntos.includes(documentoId)) throw new Error('Este documento ya está adjunto al trámite.');

      transaction.update(tramiteRef, { documentosAdjuntos: [...tramite.documentosAdjuntos, documentoId] });
      transaction.update(documentoRef, { enTramite: true });
    });
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
