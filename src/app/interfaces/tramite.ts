export interface Movimiento {
  usuarioEmisor: string;
  dependenciaEmisor: string;
  dependenciaReceptor: string;
  fechaEnvio: Date;
  fechaRecepcion: Date | null;
  fechaSalida: Date | null;
  estado: 'Enviado' | 'Recibido' | 'Devuelto' | 'Derivado';
  observaciones?: string | null;
}

export interface Tramite {
  id?: string;
  codigoTicket: string;
  dependenciaOrigen: string;
  documentoInicial: string;
  documentosAdjuntos: string[];
  dependenciaActual: string;
  estadoActual: 'Pendiente' | 'En Proceso' | 'Devuelto' | 'Finalizado';
  trazabilidad: Movimiento[];
  dependenciasInvolucradas: string[];
}