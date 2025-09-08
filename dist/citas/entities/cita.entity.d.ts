import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
export declare class Cita {
    id: string;
    fecha: Date;
    estado: string;
    paciente: Paciente;
    dentista: Dentista;
    servicios: Servicio[];
    total_pagar: number;
    observacion: string;
    recomendacion: string;
    diagnostico: string;
    tratamiento: string;
    medicamentos: string;
    instrucciones: string;
    duracion_real: number;
    paciente_asistio: boolean;
    motivo_no_asistencia: string;
    servicios_realizados: any;
    total_cobrado: number;
    metodo_pago: string;
    proxima_cita: string;
    urgencia: string;
    status: boolean;
    deleted: boolean;
    deletedAt: Date;
}
