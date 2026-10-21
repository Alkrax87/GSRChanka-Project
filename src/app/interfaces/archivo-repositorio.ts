export interface ArchivoRepositorio {
  id?: string;
  nombre: string;
  dependenciaId: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  creadoPor: {
    uid: string;
    nombre: string;
  };
  modificadoPor: {
    uid: string;
    nombre: string;
  };
  archivo: {
    nombreArchivo: string;
    ruta: string;
    url: string;
    formato: string;
    peso: number;
  };
}
