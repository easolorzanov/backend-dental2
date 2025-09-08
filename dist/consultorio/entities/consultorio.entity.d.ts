import { Dentista } from "src/dentistas/entities/dentista.entity";
import { Paciente } from "src/pacientes/entities/paciente.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
export declare class Consultorio {
    id: string;
    nombreConsultorio: string;
    direccionConsultorio: string;
    dentistas: Dentista[];
    pacientes: Paciente[];
    servicios: Servicio[];
}
