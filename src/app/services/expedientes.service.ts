import { inject, Injectable, signal } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, runTransaction, where } from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Expediente } from '../interfaces/expediente';
import { Tramite } from '../interfaces/tramite';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ExpedientesService {
  private firestore = inject(Firestore);
  private currentUser = inject(AuthService).usuarioLogged;
  private expedientesCollection = collection(this.firestore, 'expedientes');

  private _expedientesCerrados = signal<Expediente[]>([]);
  private _expedientesIniciados = signal<Expediente[]>([]);
  public expedientesCerrados = this._expedientesCerrados.asReadonly();
  public expedientesIniciados = this._expedientesIniciados.asReadonly();

  public getExpedientesCerrados() {
    const queryCerrados = query(this.expedientesCollection, where('dependenciaFinal', '==', this.currentUser()!.dependenciaId));
    collectionData(queryCerrados, { idField: 'id' }).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this._expedientesCerrados.set(data as Expediente[]),
      error: (error) => (console.error('Error cargando expedientes cerrados', error)),
    });
  }

  public getExpedientesIniciados() {
    const queryIniciados = query(this.expedientesCollection, where('dependenciaOrigen', '==', this.currentUser()!.dependenciaId));
    collectionData(queryIniciados, { idField: 'id' }).pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this._expedientesIniciados.set(data as Expediente[]),
      error: (error) => (console.error('Error cargando expedientes iniciados', error)),
    });
  }

  public async cerrarTramite(tramite: Tramite) {
    if (!tramite.id) throw new Error('No se puede cerrar un trámite sin identificador.');
    const documentoIds = Array.from(new Set([tramite.documentoInicial, ...(tramite.documentosAdjuntos || [])]));
    const tramiteRef = doc(this.firestore, `tramites/${tramite.id}`);
    const expedienteRef = doc(this.expedientesCollection);
    const documentoRefs = documentoIds.map(id => doc(this.firestore, `documentos/${id}`));
    const fechaCierre = new Date();

    const expediente: Expediente = {
      tramiteId: tramite.id,
      codigoTicket: tramite.codigoTicket,
      dependenciaOrigen: tramite.dependenciaOrigen,
      dependenciaFinal: this.currentUser()!.dependenciaId,
      fechaCierre,
      usuarioCierre: this.currentUser()!.displayName,
      documentoInicial: tramite.documentoInicial,
      documentosAdjuntos: documentoIds,
      dependenciasInvolucradas: tramite.dependenciasInvolucradas,
      trazabilidad: tramite.trazabilidad || [],
    };

    await runTransaction(this.firestore, async transaction => {
      const tramiteSnapshot = await transaction.get(tramiteRef);
      if (!tramiteSnapshot.exists()) throw new Error('El trámite ya no existe.');
      if ((tramiteSnapshot.data() as Tramite).estadoActual === 'Finalizado') {
        throw new Error('Este trámite ya fue finalizado.');
      }

      const documentoSnapshots = await Promise.all(documentoRefs.map(reference => transaction.get(reference)));
      if (documentoSnapshots.some(snapshot => !snapshot.exists())) {
        throw new Error('No se pudo cerrar el trámite porque falta uno de sus documentos.');
      }

      transaction.update(tramiteRef, { estadoActual: 'Finalizado', fechaCierre });
      transaction.set(expedienteRef, expediente);
      for (const documentoRef of documentoRefs) {
        transaction.update(documentoRef, { enTramite: true, enExpediente: true });
      }
    });
  }
}