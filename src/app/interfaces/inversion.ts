export interface Inversion {
  id?: string;
  cui:string
  nombreinversion: string;
  residente: string;
  supervisor: string;
  distrito: string;
  provincia: string;
  fecha_inicio: Date;
  fecha_final?: Date;
  prosupuesto_ejecucion: number;
  miembros_inversion: string;
  
}