import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
export declare class CitasController {
    private readonly citasService;
    constructor(citasService: CitasService);
    create(createCitaDto: CreateCitaDto): Promise<import("./entities/cita.entity").Cita>;
    actualizarEstados(): Promise<{
        message: string;
        citasActualizadas: number;
        citasEvaluadas: number;
    }>;
    findOne(id: string): Promise<import("./entities/cita.entity").Cita>;
    findByDentista(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    findByPacienteForCalendar(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    findByPaciente(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    update(id: string, updateCitaDto: UpdateCitaDto): Promise<import("./entities/cita.entity").Cita>;
    remove(id: string): Promise<{
        message: string;
    }>;
    restore(id: string): Promise<{
        message: string;
    }>;
    doneCita(id: string, completeCitaDto: any): Promise<import("./entities/cita.entity").Cita>;
    findHistoricDentista(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    findHistoricPaciente(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    findHistoricConsultorio(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    findLastByPaciente(id: string): Promise<import("./entities/cita.entity").Cita>;
    findLastByDentista(id: string): Promise<import("./entities/cita.entity").Cita>;
    findProximasCitasDentista(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    findHistoricAdmin(): Promise<import("./entities/cita.entity").Cita[]>;
    findProximasCitasPaciente(id: string): Promise<import("./entities/cita.entity").Cita[]>;
    getEstadisticasAdmin(): Promise<{
        resumen: {
            totalCitas: number;
            citasPendientes: number;
            citasCompletadas: number;
            citasNoRealizadas: number;
            porcentajeCompletadas: number;
        };
        mesActual: {
            citasEsteMes: number;
            citasCompletadasEsteMes: number;
            ingresosMes: number;
            porcentajeCompletadasMes: number;
        };
        hoy: {
            citasHoy: number;
            citasPendientesHoy: number;
        };
        proximasCitas: number;
        dentistas: any[];
        servicios: any[];
    }>;
}
