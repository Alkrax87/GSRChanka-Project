export interface Tramite {
  id?: string;
  nombre: string;
  descripcion: string;
  origen: {
    area: string;
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