import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CitasService {
  private readonly logger = new Logger('CitasService');

  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
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

  async create(createCitaDto: CreateCitaDto) {
    const citaExistente = await this.citaRepository
      .createQueryBuilder('cita')
      .where('cita.fecha = :fecha', { fecha: createCitaDto.fecha })
      .andWhere('cita.dentista = :dentista', { dentista: createCitaDto.dentista })
      .getOne();

    if (citaExistente)
      throw new BadRequestException('Ya existe una cita agendada para esta fecha y hora');

    createCitaDto.servicios = await this.servicioRepository.find({ where: { id: In(createCitaDto.servicios) } });

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
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Inicio del día
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Fin del día

    const lastCita = await this.citaRepository.createQueryBuilder('citas')
      .leftJoinAndSelect('citas.paciente', 'paciente')
      .where('citas.paciente.id = :pacienteId', { pacienteId })
      .andWhere('citas.fecha BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .getMany();

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
    if (cita) {
      cita.servicios = [];
      await this.citaRepository.save(cita);

      await this.citaRepository.remove(cita);
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