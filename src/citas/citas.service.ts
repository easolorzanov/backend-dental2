import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

import { Cron } from '@nestjs/schedule';
import { MailerService } from '@nestjs-modules/mailer';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@Injectable()
export class CitasService {
  private readonly logger = new Logger('CitasService');

  constructor(
    @InjectRepository(Cita) private readonly citaRepository: Repository<Cita>,

    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    private readonly mailerService: MailerService,
  ) {}

  @Cron('*/10 * * * *') // Ejecutar cada 10 minutos
  async actualizarCitasPendientes() {
    this.logger.debug('Verificando citas con estado PENDIENTE...');

    const ahora = new Date();

    const citasPendientes = await this.citaRepository.find({
      where: {
        estado: 'PENDIENTE',
        deleted: false,
      },
    });

    this.logger.log(
      `Encontradas ${citasPendientes.length} citas pendientes para evaluar`,
    );

    let citasActualizadas = 0;

    for (const cita of citasPendientes) {
      const fechaCita = new Date(cita.fecha);
      const fechaLimite = new Date(fechaCita);
      fechaLimite.setMinutes(fechaLimite.getMinutes() + 10); // 10 minutos de tolerancia

      this.logger.log(
        `Evaluando cita ${
          cita.id
        }: fecha=${fechaCita}, límite=${fechaLimite}, ahora=${ahora}, esPasada=${
          ahora >= fechaLimite
        }`,
      );

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

  @Cron('* 8 * * *')
  //@Cron('*/1 * * * *')
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
        const fechaFormateada = new Date(cita.fecha).toLocaleString(
          'es-ES',
          {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          },
        );

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
    } catch (error) {
      this.logger.error('Error al verificar citas:', error.message);
    }
  }

  async create(createCitaDto: CreateCitaDto) {
    const citaExistente = await this.citaRepository
      .createQueryBuilder('cita')
      .where('cita.fecha = :fecha', { fecha: createCitaDto.fecha })
      .andWhere('cita.dentista = :dentista', {
        dentista: createCitaDto.dentista,
      })
      .getOne();

    if (citaExistente)
      throw new BadRequestException(
        'Ya existe una cita agendada para esta fecha y hora',
      );

    createCitaDto.servicios = await this.servicioRepository.find({
      where: { id: In(createCitaDto.servicios) },
    });

    const pacienteCero = await this.pacienteRepository.findOneBy({
      id: createCitaDto.paciente.id,
    });

    const fechaFormateada = new Date(createCitaDto.fecha).toLocaleString(
      'es-ES',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    );

    await this.mailerService.sendMail({
      to: pacienteCero.correo,
      subject: 'Recordatorio de Cita',
      text: `
        Estimad@ ${pacienteCero.apellido} ${pacienteCero.nombre} este es un recordatorio de que usted acaba de agendar una cita con su dentista de confianza por concepto de ${createCitaDto.servicios[0].nombre} para el dia ${fechaFormateada}. Por favor, no falte.
      `,
    });

    this.logger.log(`Correo enviado a: ${pacienteCero.correo}`);

    try {
      const cita = this.citaRepository.create({
        ...createCitaDto,
        estado: 'PENDIENTE', // Asegurar que las nuevas citas sean pendientes
        status: false, // Asegurar que no estén completadas
      });
      await this.citaRepository.save(cita);
      return cita;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findAll() {
    return await this.citaRepository.find({});
  }

  async findAllByPaciente(pacienteId: string) {
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

  async findAllByPacienteForCalendar(pacienteId: string) {
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

  async findHistoricoPaciente(pacienteId: string) {
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
    this.logger.log(
      `Encontradas ${citasC.length} citas para el paciente ${pacienteId}`,
    );
    return citasC;
  }

  async findAllByDentista(dentistaId: string) {
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

  async findHistoricoDentista(dentistaId: string) {
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

  async findHistoricoConsultorio(consultorioId: string) {
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

  async findLastByPaciente(pacienteId: string) {
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

  async findLastByDentista(dentistaId: string) {
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

  async findProximasCitasDentista(dentistaId: string) {
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

  async findProximasCitasPaciente(pacienteId: string) {
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

  async findOne(id: string) {
    const cita = await this.citaRepository
      .createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .leftJoinAndSelect('citas.dentista', 'dentista')
      .leftJoinAndSelect('citas.servicios', 'servicio')
      .where('citas.id = :id', { id })
      .andWhere('citas.deleted = :deleted', { deleted: false })
      .getOne();

    if (!cita) {
      throw new NotFoundException(`Cita ${id} no encontrada o ha sido eliminada`);
    }

    return cita;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto) {
    // Verificar que la cita existe y no esté eliminada
    const citaExistente = await this.citaRepository.findOne({
      where: { id: id, deleted: false },
    });

    if (!citaExistente) {
      throw new NotFoundException(
        `Cita ${id} no encontrada o ha sido eliminada`,
      );
    }

    // Verificar que no haya conflicto con otra cita
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
      throw new BadRequestException(
        'Ya existe una cita agendada para esta fecha y hora',
      );

    updateCitaDto.servicios = await this.servicioRepository.find({
      where: { id: In(updateCitaDto.servicios) },
    });

    const cita = await this.citaRepository.preload({
      id: id,
      ...updateCitaDto,
    });

    if (!cita) throw new NotFoundException(`Cita ${id} no encontrada`);

    try {
      await this.citaRepository.save(cita);
      return cita;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const cita = await this.citaRepository.findOne({
      where: { id: id },
      relations: ['servicios'],
    });

    if (!cita) {
      throw new NotFoundException(`Cita ${id} no encontrada`);
    }

    // Verificar que la cita no esté ya eliminada
    if (cita.deleted) {
      throw new BadRequestException('La cita ya ha sido eliminada');
    }

    const fechaFormateada = new Date(cita.fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Enviar correos de notificación
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
    } catch (error) {
      this.logger.error('Error enviando correos de notificación:', error);
      // No lanzar error aquí, continuar con la eliminación lógica
    }

    // Eliminación lógica
    cita.deleted = true;
    cita.deletedAt = new Date();
    cita.estado = 'NO REALIZADA';
    cita.observacion = 'Cita eliminada por el usuario';
    cita.recomendacion = 'Cita cancelada';

    try {
      await this.citaRepository.save(cita);
      this.logger.log(`Cita ${id} eliminada lógicamente`);
      return { message: 'Cita eliminada exitosamente' };
    } catch (error) {
      this.logger.error('Error eliminando cita:', error);
      throw new InternalServerErrorException('Error al eliminar la cita');
    }
  }

  async doneCita(id: string, completeCitaDto: any) {
    const cita = await this.citaRepository.findOneBy({ id, deleted: false });
    if (!cita)
      throw new NotFoundException(
        `Cita ${id} no encontrada o ha sido eliminada`,
      );

    // Actualizar campos básicos
    cita.observacion = completeCitaDto.observacion;
    cita.recomendacion = completeCitaDto.recomendacion;
    cita.estado = 'HECHO';
    cita.status = true; // Marcar como completada

    // Actualizar campos médicos
    if (completeCitaDto.diagnostico) cita.diagnostico = completeCitaDto.diagnostico;
    if (completeCitaDto.tratamiento) cita.tratamiento = completeCitaDto.tratamiento;
    if (completeCitaDto.medicamentos) cita.medicamentos = completeCitaDto.medicamentos;
    if (completeCitaDto.instrucciones) cita.instrucciones = completeCitaDto.instrucciones;
    if (completeCitaDto.duracion_real) cita.duracion_real = completeCitaDto.duracion_real;

    // Actualizar campos de asistencia
    if (completeCitaDto.paciente_asistio !== undefined) cita.paciente_asistio = completeCitaDto.paciente_asistio;
    if (completeCitaDto.motivo_no_asistencia) cita.motivo_no_asistencia = completeCitaDto.motivo_no_asistencia;

    // Actualizar campos de servicios y cobro
    if (completeCitaDto.servicios_realizados) cita.servicios_realizados = completeCitaDto.servicios_realizados;
    if (completeCitaDto.total_cobrado) cita.total_cobrado = completeCitaDto.total_cobrado;
    if (completeCitaDto.metodo_pago) cita.metodo_pago = completeCitaDto.metodo_pago;

    // Actualizar campos de seguimiento
    if (completeCitaDto.proxima_cita) cita.proxima_cita = completeCitaDto.proxima_cita;
    if (completeCitaDto.urgencia) cita.urgencia = completeCitaDto.urgencia;

    try {
      await this.citaRepository.save(cita);
      this.logger.log(`Cita ${id} completada con datos médicos`);
      return cita;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error actualizando la cita');
    }
  }

  // Método para ejecutar manualmente la actualización de estados
  async actualizarEstadosManual() {
    this.logger.log('Ejecutando actualización manual de estados...');

    const ahora = new Date();

    // Obtener todas las citas pendientes (no eliminadas)
    const citasPendientes = await this.citaRepository
      .createQueryBuilder('citas')
      .where('citas.estado = :estado', { estado: 'PENDIENTE' })
      .andWhere('citas.deleted = :deleted', { deleted: false })
      .getMany();

    this.logger.log(
      `Encontradas ${citasPendientes.length} citas pendientes totales`,
    );

    let citasActualizadas = 0;

    for (const cita of citasPendientes) {
      const fechaCita = new Date(cita.fecha);
      const fechaLimite = new Date(fechaCita);
      fechaLimite.setMinutes(fechaLimite.getMinutes() + 10); // 10 minutos de tolerancia

      this.logger.log(
        `Evaluando cita ${
          cita.id
        }: fecha=${fechaCita}, límite=${fechaLimite}, ahora=${ahora}, esPasada=${
          ahora >= fechaLimite
        }`,
      );

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

  async restore(id: string) {
    const cita = await this.citaRepository.findOne({
      where: { id: id },
    });

    if (!cita) {
      throw new NotFoundException(`Cita ${id} no encontrada`);
    }

    if (!cita.deleted) {
      throw new BadRequestException('La cita no ha sido eliminada');
    }

    // Restaurar la cita
    cita.deleted = false;
    cita.deletedAt = null;
    cita.estado = 'PENDIENTE';
    cita.observacion = 'Cita restaurada';
    cita.recomendacion = 'Cita reactivada';

    try {
      await this.citaRepository.save(cita);
      this.logger.log(`Cita ${id} restaurada exitosamente`);
      return { message: 'Cita restaurada exitosamente' };
    } catch (error) {
      this.logger.error('Error restaurando cita:', error);
      throw new InternalServerErrorException('Error al restaurar la cita');
    }
  }
}
