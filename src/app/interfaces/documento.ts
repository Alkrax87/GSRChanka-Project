export interface Documento {
  id?: string;
  codigo: string;
  asunto: string;
  tipo: string;
  adjuntadoPorArea: string;
  fechaModificacion: Date;
  archivo: {
    nombreArchivo: string;
    ruta: string;
    url: string;
    formato: string;
    peso: number;
    fecha: Date;
  };
}