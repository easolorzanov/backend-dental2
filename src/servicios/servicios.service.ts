import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';

@Injectable()
export class ServiciosService {
  private readonly logger = new Logger('ServiciosService');

  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) { }

  async create(createServicioDto: CreateServicioDto) {
    const existeDentista = await this.findNombre(createServicioDto.nombre);
    
    if (existeDentista) throw new BadRequestException("Ya existe el Servicio")

    try {
      const servicio = this.servicioRepository.create(createServicioDto);
      await this.servicioRepository.save(servicio);
      return servicio;
    } catch (error) {
      if (error.code === '23505') throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findAll(consultorioId: string) {
    const citasC = await this.servicioRepository.createQueryBuilder('servicio')
      .leftJoinAndSelect('servicio.consultorio', 'consultorio')
      .where('servicio.consultorio.id = :consultorioId', { consultorioId })
      .getMany();
    return citasC;
  }

  async update(id: string, updateServicioDto: UpdateServicioDto) {
    
    const servicio = await this.servicioRepository.preload({
      id: id,
      ...updateServicioDto,
    });
    if (!servicio) throw new NotFoundException(`Servicio ${id} no encontrado`);

    try {
      await this.servicioRepository.save(servicio);
      return servicio;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const servicio = await this.servicioRepository.findOne({
      where: { id: id },
    });
    await this.servicioRepository.remove(servicio);
  }

  private async findNombre(nombre: string) {
    return await this.servicioRepository.findOneBy({ nombre });
  }

}