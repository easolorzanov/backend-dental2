import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDentistaDto } from './dto/create-dentista.dto';
import { UpdateDentistaDto } from './dto/update-dentista.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dentista } from './entities/dentista.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class DentistasService {
  private readonly logger = new Logger('DentistaService');

  constructor(
    @InjectRepository(Dentista)
    private readonly dentistaRepository: Repository<Dentista>,
  ) { }

  async create(createDentistaDto: CreateDentistaDto) {
    const existeDentista = await this.findCedula(createDentistaDto.identificacion);
    if (existeDentista) {
      throw new BadRequestException("Ya existe el Dentista")
    }
    try {
      const dentista = this.dentistaRepository.create(createDentistaDto);
      await this.dentistaRepository.save(dentista);
      return dentista;
    } catch (error) {
      if (error.code === '23505') throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findCedula(identificacion: string) {
    return await this.dentistaRepository.findOneBy({ identificacion });
  }

  async findOne(id: string) {
    const dentista = await this.dentistaRepository.findOneBy({ id });
    if (!dentista) throw new NotFoundException(`Dentista ${id} no encontrado`);
    return dentista;
  }

  async findOneIdUser(usuario: Usuario) {
    const paciente = await this.dentistaRepository.findOneBy({ usuario });
    if (!paciente) throw new NotFoundException(`Dentista ${usuario} no encontrado`);
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
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const dentista = await this.dentistaRepository.findOne({
      where: { id: id },
      relations: ['usuario'],
    });
    await this.dentistaRepository.remove(dentista);
  }

  async dentistaByConsultorio(consultorioId: string) {
    const dentistaConsultorio = await this.dentistaRepository.createQueryBuilder('dentistas')
      .leftJoinAndSelect('dentistas.consultorio', 'consultorio')
      .where('dentistas.consultorio.id = :consultorioId', { consultorioId })
      .getMany();
    return dentistaConsultorio;
  }

}