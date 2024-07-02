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
  ) {}

  async create(createServicioDto: CreateServicioDto) {
    const existeDentista= await this.findNombre(createServicioDto.nombre);
    if(existeDentista){
      throw new BadRequestException("Ya existe el Servicio")
    }
    try {
      const servicio = this.servicioRepository.create(createServicioDto);
      await this.servicioRepository.save(servicio);
      return servicio;
    } catch (error) {
      console.log(error);
      if (error.code === '23505') throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findNombre(nombre: string) {
    const servicio = await this.servicioRepository.findOneBy({ nombre });
    //if (!paciente) throw new NotFoundException(`Paciente ${identificacion} no encontrado`);
    return servicio;
  }

  async findAll() {
    const servicios = await this.servicioRepository.find({});
    return servicios
  }

  async findOne(id: string) {
    const servicio = await this.servicioRepository.findOneBy({ id });
    if (!servicio) throw new NotFoundException(`Servicio ${id} no encontrado`);
    return servicio;
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
      console.log(error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
     //const dentista = await this.findOne(id);
     const servicio = await this.servicioRepository.findOne({
      where: { id: id },
    });
    await this.servicioRepository.remove(servicio);
  }
}
