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
  ) {}

  async create(createCitaDto: CreateCitaDto) {
    createCitaDto.servicios = await this.servicioRepository.find({ where: { id: In(createCitaDto.servicios) } });
    try {
      //console.log(createCitaDto)
      const servicio = this.citaRepository.create(createCitaDto);
      console.log(servicio)
      await this.citaRepository.save(servicio);
      return servicio;
    } catch (error) {
      console.log(error);
      if (error.code === '23505') throw new BadRequestException(error.detail);
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
    updateCitaDto.servicios = await this.servicioRepository.find({ where: { id: In(updateCitaDto.servicios) } });
    console.log(updateCitaDto)
    const cita = await this.citaRepository.preload({
      id: id,
      ...updateCitaDto,
    });
    if (!cita) throw new NotFoundException(`Cita ${id} no encontrada`);
    //console.log(cita)
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
}
