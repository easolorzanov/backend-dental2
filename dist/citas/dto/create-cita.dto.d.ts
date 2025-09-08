import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
export declare class CreateCitaDto {
    fecha: Date;
    estado: string;
    paciente: Paciente;
    dentista: Dentista;
    servicios: Servicio[];
    total_pagar: number;
    observacion: string;
    recomendacion: string;
}
