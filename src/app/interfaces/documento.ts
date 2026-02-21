export interface Documento {
  id?: string;
  codigo: string;
  tipo: string;
  adjuntadoPorArea: string;
  archivo: {
    nombreArchivo: string;
    ruta: string;
    url: string;
    formato: string;
    peso: number;
    fecha: Date;
  };
}