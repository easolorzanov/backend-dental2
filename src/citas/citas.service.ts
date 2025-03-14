import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    private readonly mailerService: MailerService,
  ) { }

  @Cron('10 * * * *')
  async actualizarCitasPendientes() {
    this.logger.debug('Verificando citas con estado PENDIENTE...');

    const ahora = new Date();

    const citasPendientes = await this.citaRepository.find({
      where: {
        estado: 'PENDIENTE',
      },
    });

    for (const cita of citasPendientes) {
      const fechaLimite = new Date(cita.fecha);
      fechaLimite.setMinutes(fechaLimite.getMinutes() + 10);
      if (ahora >= fechaLimite) {
        cita.estado = 'NO REALIZADA';
        cita.observacion = 'NO REALIZADA';
        cita.recomendacion = 'NO REALIZADA';
        await this.citaRepository.save(cita);
        this.logger.log(`Cita ${cita.id} marcada como NO REALIZADA.`);
      }
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

      const usuarios = citasNext.map((cita) => cita)//.paciente.correo);
      for (const usuario of usuarios) {
        const fechaFormateada = new Date(usuario.fecha).toLocaleString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });

        await this.mailerService.sendMail({
          to: usuario.paciente.correo,
          subject: 'Recordatorio de Cita',
          text: `
            Estimad@ ${usuario.paciente.apellido} ${usuario.paciente.nombre} este es un recordatorio de que tiene una cita programada para el dia de mañana ${fechaFormateada}. Por favor, no falte.
          `,
        });
        this.logger.log(`Correo enviado a: ${usuario.paciente.correo}`);
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
      .andWhere('cita.dentista = :dentista', { dentista: createCitaDto.dentista })
      .getOne();

    if (citaExistente)
      throw new BadRequestException('Ya existe una cita agendada para esta fecha y hora');

    createCitaDto.servicios = await this.servicioRepository.find({ where: { id: In(createCitaDto.servicios) } });

    const pacienteCero = await this.pacienteRepository.findOneBy({id: createCitaDto.paciente.id})

    const fechaFormateada = new Date(createCitaDto.fecha).toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
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
      const servicio = this.citaRepository.create(createCitaDto);
      await this.citaRepository.save(servicio);
      return servicio;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findAll() {
    const citas = await this.citaRepository.find({});
    return citas
  }

  async findByPaciente(pacienteId: string) {
    const citasC = await this.citaRepository.createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .leftJoinAndSelect('citas.dentista', 'dentista')
      .leftJoinAndSelect('citas.servicios', 'servicio')
      .where('citas.paciente.id = :pacienteId', { pacienteId })
      .andWhere('citas.status = :status', { status: false })
      .getMany();
    return citasC;
  }

  async findByDentista(dentistaId: string) {
    const citasC = await this.citaRepository.createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .leftJoinAndSelect('citas.dentista', 'dentista')
      .leftJoinAndSelect('citas.servicios', 'servicio')
      .where('citas.dentista.id = :dentistaId', { dentistaId })
      .andWhere('citas.estado = :estado', { estado: 'PENDIENTE' })
      .andWhere('citas.status = :status', { status: false })
      .getMany();
    return citasC;
  }

  async findByDentista2(dentistaId: string) {
    const citasC = await this.citaRepository.createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .leftJoinAndSelect('citas.dentista', 'dentista')
      .leftJoinAndSelect('citas.servicios', 'servicio')
      .where('citas.dentista.id = :dentistaId', { dentistaId })
      .orderBy('citas.fecha', 'DESC')
      .getMany();
    return citasC;
  }

  async findLastByPaciente(pacienteId: string) {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const lastCita = await this.citaRepository.createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .where('citas.paciente.id = :pacienteId', { pacienteId })
      .andWhere('citas.fecha BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .getOne();

    return lastCita;
  }

  async findOne(id: string) {
    const citasC = await this.citaRepository.createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .leftJoinAndSelect('citas.dentista', 'dentista')
      .leftJoinAndSelect('citas.servicios', 'servicio')
      .where('citas.id = :id', { id })
      .getMany();
    return citasC;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto) {
    const citaExistente = await this.citaRepository
      .createQueryBuilder('cita')
      .where('cita.fecha = :fecha', { fecha: updateCitaDto.fecha })
      .andWhere('cita.dentista = :dentista', { dentista: updateCitaDto.dentista })
      .getOne();

    if (citaExistente) throw new BadRequestException('Ya existe una cita agendada para esta fecha y hora');

    updateCitaDto.servicios = await this.servicioRepository.find({ where: { id: In(updateCitaDto.servicios) } });
    const cita = await this.citaRepository.preload({
      id: id,
      ...updateCitaDto,
    });
    if (!cita) throw new NotFoundException(`Cita ${id} no encontrada`);
    try {
      await this.citaRepository.save(cita);
      return cita;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const cita = await this.citaRepository.findOne({
      where: { id: id },
      relations: ['servicios'],
    });

    const fechaFormateada = new Date(cita.fecha).toLocaleString('es-ES', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });

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

    if (cita) {
      cita.status = true;
      cita.estado = 'NO REALIZADA'
      await this.citaRepository.save(cita);
    } else {
      throw new Error('Cita no encontrada');
    }
  }

  async doneCita(id: string, observacion: string, recomendacion: string) {
    const cita = await this.citaRepository.findOneBy({ id });
    if (!cita)
      throw new NotFoundException(`Cita ${id} no encontrada`);

    cita.observacion = observacion;
    cita.recomendacion = recomendacion;
    cita.estado = 'HECHO';

    try {
      await this.citaRepository.save(cita);
      return cita;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error actualizando la cita');
    }
  }
}