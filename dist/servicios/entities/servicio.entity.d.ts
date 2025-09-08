import { Cita } from 'src/citas/entities/cita.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
export declare class Servicio {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    consultorio: Consultorio;
    citas: Cita[];
}
