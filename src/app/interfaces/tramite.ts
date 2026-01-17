export interface Documento {
  id: string;
  nombre: string;
  tipo: 'Revisión' | 'Oficio' | 'Documento' | 'TdR' | 'Otro';
  adjuntadoPorArea: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
  rutaArchivo: string;
}

export interface Movimiento {
  areaOrigen: string;
  areaDestino: string | null;
  fechaIngreso: Date;
  fechaSalida: Date | null;
  responsable: string | null;
  prioridad: 'Sin Determinar' | 'Baja' | 'Media' | 'Alta';
  estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  observaciones: string;
}

export interface Tramite {
  id?: string;
  asunto: string;
  documentos: Documento[];
  trazabilidad: Movimiento[];
  estadoGlobal: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  areaActual: string;
  areaCreacion: string;
}