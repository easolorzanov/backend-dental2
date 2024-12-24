import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Injectable()
export class CitasService {
  private readonly logger = new Logger('CitasService');

  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) { }

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
      .orderBy('citas.fecha', 'ASC')
      .getMany();
    return citasC;
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

  async doneCita(id: string) {
    const cita = await this.citaRepository.findOneBy({ id: id });
    if (!cita) throw new NotFoundException(`Cita ${id} no encontrada`);
    cita.estado = 'HECHO';
    await this.citaRepository.save(cita);
    return cita;
  }
}