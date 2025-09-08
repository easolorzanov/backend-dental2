import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
export declare class CitasService {
    private readonly citaRepository;
    private readonly servicioRepository;
    private readonly pacienteRepository;
    private readonly mailerService;
    private readonly logger;
    constructor(citaRepository: Repository<Cita>, servicioRepository: Repository<Servicio>, pacienteRepository: Repository<Paciente>, mailerService: MailerService);
    actualizarCitasPendientes(): Promise<void>;
    verificarCitas(): Promise<string>;
    create(createCitaDto: CreateCitaDto): Promise<Cita>;
    findAll(): Promise<Cita[]>;
    findAllByPaciente(pacienteId: string): Promise<Cita[]>;
    findAllByPacienteForCalendar(pacienteId: string): Promise<Cita[]>;
    findHistoricoPaciente(pacienteId: string): Promise<Cita[]>;
    findAllByDentista(dentistaId: string): Promise<Cita[]>;
    findHistoricoDentista(dentistaId: string): Promise<Cita[]>;
    findHistoricoConsultorio(consultorioId: string): Promise<Cita[]>;
    findHistoricoAdmin(): Promise<Cita[]>;
    findLastByPaciente(pacienteId: string): Promise<Cita>;
    findLastByDentista(dentistaId: string): Promise<Cita>;
    findProximasCitasDentista(dentistaId: string): Promise<Cita[]>;
    findProximasCitasPaciente(pacienteId: string): Promise<Cita[]>;
    findOne(id: string): Promise<Cita>;
    update(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita>;
    remove(id: string): Promise<{
        message: string;
    }>;
    doneCita(id: string, completeCitaDto: any): Promise<Cita>;
    actualizarEstadosManual(): Promise<{
        message: string;
        citasActualizadas: number;
        citasEvaluadas: number;
    }>;
    restore(id: string): Promise<{
        message: string;
    }>;
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
