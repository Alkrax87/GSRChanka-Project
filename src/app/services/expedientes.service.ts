import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
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
    const expediente: Expediente = {
      tramiteId: tramite.id!,
      codigoTicket: tramite.codigoTicket,
      dependenciaOrigen: tramite.dependenciaOrigen,
      dependenciaFinal: this.currentUser()!.dependenciaId,
      fechaCierre: new Date(),
      usuarioCierre: this.currentUser()!.displayName,
      documentoInicial: tramite.documentoInicial,
      documentosAdjuntos: tramite.documentosAdjuntos || [],
      dependenciasInvolucradas: tramite.dependenciasInvolucradas,
      trazabilidad: tramite.trazabilidad || [],
    };

    await addDoc(this.expedientesCollection, expediente);
  }
}