"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cita_entity_1 = require("./entities/cita.entity");
const servicio_entity_1 = require("../servicios/entities/servicio.entity");
const schedule_1 = require("@nestjs/schedule");
const mailer_1 = require("@nestjs-modules/mailer");
const paciente_entity_1 = require("../pacientes/entities/paciente.entity");
let CitasService = class CitasService {
    constructor(citaRepository, servicioRepository, pacienteRepository, mailerService) {
        this.citaRepository = citaRepository;
        this.servicioRepository = servicioRepository;
        this.pacienteRepository = pacienteRepository;
        this.mailerService = mailerService;
        this.logger = new common_1.Logger('CitasService');
    }
    async actualizarCitasPendientes() {
        this.logger.debug('Verificando citas con estado PENDIENTE...');
        const ahora = new Date();
        const citasPendientes = await this.citaRepository.find({
            where: {
                estado: 'PENDIENTE',
                deleted: false,
            },
        });
        this.logger.log(`Encontradas ${citasPendientes.length} citas pendientes para evaluar`);
        let citasActualizadas = 0;
        for (const cita of citasPendientes) {
            const fechaCita = new Date(cita.fecha);
            const fechaLimite = new Date(fechaCita);
            fechaLimite.setMinutes(fechaLimite.getMinutes() + 10);
            this.logger.log(`Evaluando cita ${cita.id}: fecha=${fechaCita}, límite=${fechaLimite}, ahora=${ahora}, esPasada=${ahora >= fechaLimite}`);
            if (ahora >= fechaLimite) {
                cita.estado = 'NO REALIZADA';
                cita.observacion = 'Cita no realizada - Pasó la hora límite';
                cita.recomendacion = 'Reprogramar cita';
                await this.citaRepository.save(cita);
                citasActualizadas++;
                this.logger.log(`✅ Cita ${cita.id} marcada como NO REALIZADA.`);
            }
        }
        if (citasActualizadas > 0) {
            this.logger.log(`Total de citas actualizadas: ${citasActualizadas}`);
        }
    }
    async verificarCitas() {
        this.logger.debug('Ejecutando tarea Cron para verificar citas...');
        const hoy = new Date();
        const inicioManana = new Date(hoy);
        inicioManana.setDate(hoy.getDate() + 1);
        inicioManana.setHours(7, 0, 0, 0);
        const finManana = new Date(inicioManana);
        finManana.setHours(19, 0, 0, 0);
        try {
            const citasNext = await this.citaRepository
                .createQueryBuilder('citas')
                .leftJoinAndSelect('citas.paciente', 'paciente')
                .where('citas.fecha BETWEEN :inicio AND :fin', {
                inicio: inicioManana,
                fin: finManana,
            })
                .getMany();
            for (const cita of citasNext) {
                const fechaFormateada = new Date(cita.fecha).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                });
                await this.mailerService.sendMail({
                    to: cita.paciente.correo,
                    subject: 'Recordatorio de Cita',
                    text: `
            Estimad@ ${cita.paciente.apellido} ${cita.paciente.nombre} este es un recordatorio de que tiene una cita programada para el dia de mañana ${fechaFormateada}. Por favor, no falte.
          `,
                });
                this.logger.log(`Correo enviado a: ${cita.paciente.correo}`);
            }
            return 'ok';
        }
        catch (error) {
            this.logger.error('Error al verificar citas:', error.message);
        }
    }
    async create(createCitaDto) {
        const citaExistente = await this.citaRepository
            .createQueryBuilder('cita')
            .where('cita.fecha = :fecha', { fecha: createCitaDto.fecha })
            .andWhere('cita.dentista = :dentista', {
            dentista: createCitaDto.dentista,
        })
            .getOne();
        if (citaExistente)
            throw new common_1.BadRequestException('Ya existe una cita agendada para esta fecha y hora');
        createCitaDto.servicios = await this.servicioRepository.find({
            where: { id: (0, typeorm_2.In)(createCitaDto.servicios) },
        });
        const pacienteCero = await this.pacienteRepository.findOneBy({
            id: createCitaDto.paciente.id,
        });
        const fechaFormateada = new Date(createCitaDto.fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        await this.mailerService.sendMail({
            to: pacienteCero.correo,
            subject: 'Recordatorio de Cita',
            text: `
        Estimad@ ${pacienteCero.apellido} ${pacienteCero.nombre} este es un recordatorio de que usted acaba de agendar una cita con su dentista de confianza por concepto de ${createCitaDto.servicios[0].nombre} para el dia ${fechaFormateada}. Por favor, no falte.
      `,
        });
        this.logger.log(`Correo enviado a: ${pacienteCero.correo}`);
        try {
            const cita = this.citaRepository.create(Object.assign(Object.assign({}, createCitaDto), { estado: 'PENDIENTE', status: false }));
            await this.citaRepository.save(cita);
            return cita;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.BadRequestException(error.detail);
            }
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error no esperado');
        }
    }
    async findAll() {
        return await this.citaRepository.find({});
    }
    async findAllByPaciente(pacienteId) {
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.paciente.id = :pacienteId', { pacienteId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'ASC')
            .getMany();
        return citasC;
    }
    async findAllByPacienteForCalendar(pacienteId) {
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.paciente.id = :pacienteId', { pacienteId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'ASC')
            .getMany();
        return citasC;
    }
    async findHistoricoPaciente(pacienteId) {
        this.logger.log(`Buscando historial de citas para paciente: ${pacienteId}`);
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.paciente.id = :pacienteId', { pacienteId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'DESC')
            .getMany();
        this.logger.log(`Encontradas ${citasC.length} citas para el paciente ${pacienteId}`);
        return citasC;
    }
    async findAllByDentista(dentistaId) {
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.dentista.id = :dentistaId', { dentistaId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'ASC')
            .getMany();
        return citasC;
    }
    async findHistoricoDentista(dentistaId) {
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.dentista.id = :dentistaId', { dentistaId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'DESC')
            .getMany();
        return citasC;
    }
    async findHistoricoConsultorio(consultorioId) {
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('dentista.consultorio', 'consultorio')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('consultorio.id = :consultorioId', { consultorioId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'DESC')
            .getMany();
        return citasC;
    }
    async findHistoricoAdmin() {
        this.logger.log('Buscando historial de citas para administrador');
        const citasC = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'DESC')
            .getMany();
        this.logger.log(`Encontradas ${citasC.length} citas para el administrador`);
        return citasC;
    }
    async findLastByPaciente(pacienteId) {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
        const lastCita = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.paciente.id = :pacienteId', { pacienteId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .andWhere('citas.fecha BETWEEN :startOfDay AND :endOfDay', {
            startOfDay,
            endOfDay,
        })
            .getOne();
        return lastCita;
    }
    async findLastByDentista(dentistaId) {
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
        const lastCita = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.dentista.id = :dentistaId', { dentistaId })
            .andWhere('citas.fecha BETWEEN :startOfDay AND :endOfDay', {
            startOfDay,
            endOfDay,
        })
            .andWhere('citas.estado = :estado', { estado: 'PENDIENTE' })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .orderBy('citas.fecha', 'ASC')
            .limit(1)
            .getOne();
        return lastCita;
    }
    async findProximasCitasDentista(dentistaId) {
        const currentDate = new Date();
        const proximasCitas = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.dentista.id = :dentistaId', { dentistaId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .andWhere('citas.fecha >= :currentDate', { currentDate })
            .andWhere('citas.estado = :estado', { estado: 'PENDIENTE' })
            .orderBy('citas.fecha', 'ASC')
            .limit(10)
            .getMany();
        return proximasCitas;
    }
    async findProximasCitasPaciente(pacienteId) {
        const currentDate = new Date();
        const proximasCitas = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.paciente.id = :pacienteId', { pacienteId })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .andWhere('citas.fecha >= :currentDate', { currentDate })
            .andWhere('citas.estado = :estado', { estado: 'PENDIENTE' })
            .orderBy('citas.fecha', 'ASC')
            .limit(5)
            .getMany();
        return proximasCitas;
    }
    async findOne(id) {
        const cita = await this.citaRepository
            .createQueryBuilder('citas')
            .leftJoinAndSelect('citas.paciente', 'paciente')
            .leftJoinAndSelect('citas.dentista', 'dentista')
            .leftJoinAndSelect('citas.servicios', 'servicio')
            .where('citas.id = :id', { id })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .getOne();
        if (!cita) {
            throw new common_1.NotFoundException(`Cita ${id} no encontrada o ha sido eliminada`);
        }
        return cita;
    }
    async update(id, updateCitaDto) {
        const citaExistente = await this.citaRepository.findOne({
            where: { id: id, deleted: false },
            relations: ['paciente', 'dentista', 'servicios'],
        });
        if (!citaExistente) {
            throw new common_1.NotFoundException(`Cita ${id} no encontrada o ha sido eliminada`);
        }
        const citaConflictiva = await this.citaRepository
            .createQueryBuilder('cita')
            .where('cita.fecha = :fecha', { fecha: updateCitaDto.fecha })
            .andWhere('cita.dentista = :dentista', {
            dentista: updateCitaDto.dentista,
        })
            .andWhere('cita.id != :id', { id })
            .andWhere('cita.deleted = :deleted', { deleted: false })
            .getOne();
        if (citaConflictiva)
            throw new common_1.BadRequestException('Ya existe una cita agendada para esta fecha y hora');
        updateCitaDto.servicios = await this.servicioRepository.find({
            where: { id: (0, typeorm_2.In)(updateCitaDto.servicios) },
        });
        const cita = await this.citaRepository.preload(Object.assign({ id: id }, updateCitaDto));
        if (!cita)
            throw new common_1.NotFoundException(`Cita ${id} no encontrada`);
        const fechaCambio = new Date(citaExistente.fecha).getTime() !== new Date(updateCitaDto.fecha).getTime();
        const dentistaIdNuevo = typeof updateCitaDto.dentista === 'object' ? updateCitaDto.dentista.id : updateCitaDto.dentista;
        const dentistaCambio = citaExistente.dentista.id !== dentistaIdNuevo;
        if (fechaCambio || dentistaCambio) {
            const fechaAnteriorFormateada = new Date(citaExistente.fecha).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
            const fechaNuevaFormateada = new Date(updateCitaDto.fecha).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
            try {
                await this.mailerService.sendMail({
                    to: citaExistente.paciente.correo,
                    subject: 'Cita modificada',
                    text: `
            Estimad@ ${citaExistente.paciente.apellido} ${citaExistente.paciente.nombre}, 
            
            Su cita ha sido modificada:
            
            ${fechaCambio ? `• Fecha anterior: ${fechaAnteriorFormateada}
            • Nueva fecha: ${fechaNuevaFormateada}` : ''}
            
            ${dentistaCambio ? `• Se ha cambiado el dentista asignado` : ''}
            
            Por favor, tome nota de estos cambios y no falte a su cita.
          `,
                });
                this.logger.log(`Correo de modificación enviado al paciente: ${citaExistente.paciente.correo}`);
                if (fechaCambio) {
                    await this.mailerService.sendMail({
                        to: citaExistente.dentista.correo,
                        subject: 'Cita reprogramada',
                        text: `
              Estimad@ ${citaExistente.dentista.apellido} ${citaExistente.dentista.nombre},
              
              La cita del paciente ${citaExistente.paciente.apellido} ${citaExistente.paciente.nombre} 
              ha sido reprogramada:
              
              • Fecha anterior: ${fechaAnteriorFormateada}
              • Nueva fecha: ${fechaNuevaFormateada}
              
              Por favor, actualice su agenda con la nueva fecha.
            `,
                    });
                    this.logger.log(`Correo de reprogramación enviado al dentista: ${citaExistente.dentista.correo}`);
                }
            }
            catch (error) {
                this.logger.error('Error enviando correos de notificación de modificación:', error);
            }
        }
        try {
            await this.citaRepository.save(cita);
            return cita;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.detail);
        }
    }
    async remove(id) {
        const cita = await this.citaRepository.findOne({
            where: { id: id },
            relations: ['servicios'],
        });
        if (!cita) {
            throw new common_1.NotFoundException(`Cita ${id} no encontrada`);
        }
        if (cita.deleted) {
            throw new common_1.BadRequestException('La cita ya ha sido eliminada');
        }
        const fechaFormateada = new Date(cita.fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
        try {
            await this.mailerService.sendMail({
                to: cita.paciente.correo,
                subject: 'Cita cancelada',
                text: `
          Estimad@ ${cita.paciente.apellido} ${cita.paciente.nombre} usted ha eliminado una cita programada para el dia${fechaFormateada}, con su ${cita.dentista.especialidad} ${cita.dentista.apellido} ${cita.dentista.nombre}.
        `,
            });
            this.logger.log(`Correo enviado a: ${cita.paciente.correo}`);
            await this.mailerService.sendMail({
                to: cita.dentista.correo,
                subject: 'Cita cancelada',
                text: `
          Estimad@ ${cita.dentista.apellido} ${cita.dentista.nombre}, el paciente ${cita.paciente.apellido} ${cita.paciente.nombre} ha eliminado una cita programada para el dia ${fechaFormateada}.
        `,
            });
            this.logger.log(`Correo enviado a: ${cita.dentista.correo}`);
        }
        catch (error) {
            this.logger.error('Error enviando correos de notificación:', error);
        }
        cita.deleted = true;
        cita.deletedAt = new Date();
        cita.estado = 'NO REALIZADA';
        cita.observacion = 'Cita eliminada por el usuario';
        cita.recomendacion = 'Cita cancelada';
        try {
            await this.citaRepository.save(cita);
            this.logger.log(`Cita ${id} eliminada lógicamente`);
            return { message: 'Cita eliminada exitosamente' };
        }
        catch (error) {
            this.logger.error('Error eliminando cita:', error);
            throw new common_1.InternalServerErrorException('Error al eliminar la cita');
        }
    }
    async doneCita(id, completeCitaDto) {
        const cita = await this.citaRepository.findOneBy({ id, deleted: false });
        if (!cita)
            throw new common_1.NotFoundException(`Cita ${id} no encontrada o ha sido eliminada`);
        cita.observacion = completeCitaDto.observacion;
        cita.recomendacion = completeCitaDto.recomendacion;
        cita.estado = 'HECHO';
        cita.status = true;
        if (completeCitaDto.diagnostico)
            cita.diagnostico = completeCitaDto.diagnostico;
        if (completeCitaDto.tratamiento)
            cita.tratamiento = completeCitaDto.tratamiento;
        if (completeCitaDto.medicamentos)
            cita.medicamentos = completeCitaDto.medicamentos;
        if (completeCitaDto.instrucciones)
            cita.instrucciones = completeCitaDto.instrucciones;
        if (completeCitaDto.duracion_real)
            cita.duracion_real = completeCitaDto.duracion_real;
        if (completeCitaDto.paciente_asistio !== undefined)
            cita.paciente_asistio = completeCitaDto.paciente_asistio;
        if (completeCitaDto.motivo_no_asistencia)
            cita.motivo_no_asistencia = completeCitaDto.motivo_no_asistencia;
        if (completeCitaDto.servicios_realizados)
            cita.servicios_realizados = completeCitaDto.servicios_realizados;
        if (completeCitaDto.total_cobrado)
            cita.total_cobrado = completeCitaDto.total_cobrado;
        if (completeCitaDto.metodo_pago)
            cita.metodo_pago = completeCitaDto.metodo_pago;
        if (completeCitaDto.proxima_cita)
            cita.proxima_cita = completeCitaDto.proxima_cita;
        if (completeCitaDto.urgencia)
            cita.urgencia = completeCitaDto.urgencia;
        try {
            await this.citaRepository.save(cita);
            this.logger.log(`Cita ${id} completada con datos médicos`);
            return cita;
        }
        catch (error) {
            this.logger.error(error);
            throw new common_1.InternalServerErrorException('Error actualizando la cita');
        }
    }
    async actualizarEstadosManual() {
        this.logger.log('Ejecutando actualización manual de estados...');
        const ahora = new Date();
        const citasPendientes = await this.citaRepository
            .createQueryBuilder('citas')
            .where('citas.estado = :estado', { estado: 'PENDIENTE' })
            .andWhere('citas.deleted = :deleted', { deleted: false })
            .getMany();
        this.logger.log(`Encontradas ${citasPendientes.length} citas pendientes totales`);
        let citasActualizadas = 0;
        for (const cita of citasPendientes) {
            const fechaCita = new Date(cita.fecha);
            const fechaLimite = new Date(fechaCita);
            fechaLimite.setMinutes(fechaLimite.getMinutes() + 10);
            this.logger.log(`Evaluando cita ${cita.id}: fecha=${fechaCita}, límite=${fechaLimite}, ahora=${ahora}, esPasada=${ahora >= fechaLimite}`);
            if (ahora >= fechaLimite) {
                cita.estado = 'NO REALIZADA';
                cita.observacion = 'Cita no realizada - Pasó la hora límite';
                cita.recomendacion = 'Reprogramar cita';
                await this.citaRepository.save(cita);
                citasActualizadas++;
                this.logger.log(`✅ Cita ${cita.id} marcada como NO REALIZADA.`);
            }
        }
        this.logger.log(`Total de citas actualizadas: ${citasActualizadas}`);
        return {
            message: 'Estados actualizados correctamente',
            citasActualizadas: citasActualizadas,
            citasEvaluadas: citasPendientes.length,
        };
    }
    async restore(id) {
        const cita = await this.citaRepository.findOne({
            where: { id: id },
        });
        if (!cita) {
            throw new common_1.NotFoundException(`Cita ${id} no encontrada`);
        }
        if (!cita.deleted) {
            throw new common_1.BadRequestException('La cita no ha sido eliminada');
        }
        cita.deleted = false;
        cita.deletedAt = null;
        cita.estado = 'PENDIENTE';
        cita.observacion = 'Cita restaurada';
        cita.recomendacion = 'Cita reactivada';
        try {
            await this.citaRepository.save(cita);
            this.logger.log(`Cita ${id} restaurada exitosamente`);
            return { message: 'Cita restaurada exitosamente' };
        }
        catch (error) {
            this.logger.error('Error restaurando cita:', error);
            throw new common_1.InternalServerErrorException('Error al restaurar la cita');
        }
    }
    async getEstadisticasAdmin() {
        this.logger.log('Obteniendo estadísticas para administrador');
        try {
            const totalCitas = await this.citaRepository.count({
                where: { deleted: false }
            });
            const citasPendientes = await this.citaRepository.count({
                where: { estado: 'PENDIENTE', deleted: false }
            });
            const citasCompletadas = await this.citaRepository.count({
                where: { estado: 'HECHO', deleted: false }
            });
            const citasNoRealizadas = await this.citaRepository.count({
                where: { estado: 'NO REALIZADA', deleted: false }
            });
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);
            const finMes = new Date();
            finMes.setMonth(finMes.getMonth() + 1);
            finMes.setDate(0);
            finMes.setHours(23, 59, 59, 999);
            const citasEsteMes = await this.citaRepository.count({
                where: {
                    fecha: (0, typeorm_2.Between)(inicioMes, finMes),
                    deleted: false
                }
            });
            const citasCompletadasEsteMes = await this.citaRepository.count({
                where: {
                    fecha: (0, typeorm_2.Between)(inicioMes, finMes),
                    estado: 'HECHO',
                    deleted: false
                }
            });
            const ingresosResult = await this.citaRepository
                .createQueryBuilder('cita')
                .select('SUM(cita.total_cobrado)', 'total')
                .where('cita.fecha BETWEEN :inicio AND :fin', {
                inicio: inicioMes,
                fin: finMes
            })
                .andWhere('cita.estado = :estado', { estado: 'HECHO' })
                .andWhere('cita.deleted = :deleted', { deleted: false })
                .getRawOne();
            const ingresosMes = parseFloat((ingresosResult === null || ingresosResult === void 0 ? void 0 : ingresosResult.total) || '0');
            const hoy = new Date();
            const inicioHoy = new Date(hoy);
            inicioHoy.setHours(0, 0, 0, 0);
            const finHoy = new Date(hoy);
            finHoy.setHours(23, 59, 59, 999);
            const citasHoy = await this.citaRepository.count({
                where: {
                    fecha: (0, typeorm_2.Between)(inicioHoy, finHoy),
                    deleted: false
                }
            });
            const citasPendientesHoy = await this.citaRepository.count({
                where: {
                    fecha: (0, typeorm_2.Between)(inicioHoy, finHoy),
                    estado: 'PENDIENTE',
                    deleted: false
                }
            });
            const proximosSieteDias = new Date();
            proximosSieteDias.setDate(proximosSieteDias.getDate() + 7);
            const proximasCitas = await this.citaRepository.count({
                where: {
                    fecha: (0, typeorm_2.Between)(new Date(), proximosSieteDias),
                    estado: 'PENDIENTE',
                    deleted: false
                }
            });
            const estadisticasDentistas = await this.citaRepository
                .createQueryBuilder('cita')
                .leftJoin('cita.dentista', 'dentista')
                .select([
                'dentista.nombre as nombre',
                'dentista.apellido as apellido',
                'COUNT(cita.id) as total_citas',
                'SUM(CASE WHEN cita.estado = \'HECHO\' THEN 1 ELSE 0 END) as citas_completadas'
            ])
                .where('cita.deleted = :deleted', { deleted: false })
                .groupBy('dentista.id, dentista.nombre, dentista.apellido')
                .orderBy('total_citas', 'DESC')
                .limit(5)
                .getRawMany();
            const serviciosMasSolicitados = await this.citaRepository
                .createQueryBuilder('cita')
                .leftJoin('cita.servicios', 'servicio')
                .select([
                'servicio.nombre as nombre',
                'COUNT(servicio.id) as total_solicitudes'
            ])
                .where('cita.deleted = :deleted', { deleted: false })
                .groupBy('servicio.id, servicio.nombre')
                .orderBy('total_solicitudes', 'DESC')
                .limit(5)
                .getRawMany();
            const estadisticas = {
                resumen: {
                    totalCitas,
                    citasPendientes,
                    citasCompletadas,
                    citasNoRealizadas,
                    porcentajeCompletadas: totalCitas > 0 ? Math.round((citasCompletadas / totalCitas) * 100) : 0
                },
                mesActual: {
                    citasEsteMes,
                    citasCompletadasEsteMes,
                    ingresosMes,
                    porcentajeCompletadasMes: citasEsteMes > 0 ? Math.round((citasCompletadasEsteMes / citasEsteMes) * 100) : 0
                },
                hoy: {
                    citasHoy,
                    citasPendientesHoy
                },
                proximasCitas,
                dentistas: estadisticasDentistas,
                servicios: serviciosMasSolicitados
            };
            this.logger.log('Estadísticas generadas exitosamente');
            return estadisticas;
        }
        catch (error) {
            this.logger.error('Error obteniendo estadísticas:', error);
            throw new common_1.InternalServerErrorException('Error al obtener estadísticas');
        }
    }
};
exports.CitasService = CitasService;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CitasService.prototype, "actualizarCitasPendientes", null);
__decorate([
    (0, schedule_1.Cron)('* 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CitasService.prototype, "verificarCitas", null);
exports.CitasService = CitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cita_entity_1.Cita)),
    __param(1, (0, typeorm_1.InjectRepository)(servicio_entity_1.Servicio)),
    __param(2, (0, typeorm_1.InjectRepository)(paciente_entity_1.Paciente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        mailer_1.MailerService])
], CitasService);
//# sourceMappingURL=citas.service.js.map