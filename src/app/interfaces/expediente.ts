import { Movimiento } from './tramite';

export interface Expediente {
  id?: string;
  tramiteId: string;
  codigoTicket: string;
  dependenciaOrigen: string;
  dependenciaFinal: string;
  fechaCierre: Date;
  usuarioCierre: string;
  documentoInicial: string;
  documentosAdjuntos: string[];
  dependenciasInvolucradas: string[];
  trazabilidad: Movimiento[];
}