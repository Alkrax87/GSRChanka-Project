export interface Tramite {
  id?: string;
  nombre: string;
  correspondencia: {
    area: string;
    actual: {
      remitente: string;
      destinatario: string;
      asunto: string;
      numeroDocumento: string;
      tipo: 'Revisión' | 'Oficio' | 'Documento' | 'TdR' | 'Otro';
    };
    previo: {
      remitente: string;
      destinatario: string;
      asunto: string;
      numeroDocumento: string;
      tipo: 'Revisión' | 'Oficio' | 'Documento' | 'TdR' | 'Otro';
    };
  };
  origen: {
    area: string;
    estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
    fecha: string;
  }
  ubicacionActual: {
    area: string;
    fechaIngreso: string;
    estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  }
  trazabilidadAreas: {
    area: string;
    fechaIngreso: string;
    fechaSalida?: string;
    estado: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  }[];
}