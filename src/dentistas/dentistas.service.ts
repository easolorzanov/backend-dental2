import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDentistaDto } from './dto/create-dentista.dto';
import { UpdateDentistaDto } from './dto/update-dentista.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dentista } from './entities/dentista.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DentistasService {
  private readonly logger = new Logger('DentistaService');

  constructor(
    @InjectRepository(Dentista)
    private readonly dentistaRepository: Repository<Dentista>,
  ) {}

  async create(createDentistaDto: CreateDentistaDto) {
    const existeDentista= await this.findCedula(createDentistaDto.identificacion);
    if(existeDentista){
      throw new BadRequestException("Ya existe el Dentista")
    }
    try {
      const dentista = this.dentistaRepository.create(createDentistaDto);
      await this.dentistaRepository.save(dentista);
      return dentista;
    } catch (error) {
      console.log(error);
      if (error.code === '23505') throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findCedula(identificacion: string) {
    const cedula = await this.dentistaRepository.findOneBy({ identificacion });
    //if (!paciente) throw new NotFoundException(`Paciente ${identificacion} no encontrado`);
    return cedula;
  }

  async findAll() {
    const dentistas = await this.dentistaRepository.find({});
    return dentistas
  }

  async findOne(id: string) {
    const paciente = await this.dentistaRepository.findOneBy({ id });
    if (!paciente) throw new NotFoundException(`Paciente ${id} no encontrado`);
    return paciente;
  }

  async update(id: string, updateDentistaDto: UpdateDentistaDto) {
    const dentista = await this.dentistaRepository.preload({
      id: id,
      ...updateDentistaDto,
    });
    if (!dentista) throw new NotFoundException(`Paciente ${id} no encontrado`);

    try {
      await this.dentistaRepository.save(dentista);
      return dentista;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const dentista = await this.findOne(id);
    await this.dentistaRepository.remove(dentista);
  }
}
