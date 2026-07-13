export interface Area {
  id?: string;
  nombre: string;
  usuarios: number;
  documentos: {
    contador: number;
    total: number;
  };
}