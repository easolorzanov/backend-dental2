import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class PacientesService {
  private readonly logger = new Logger('PacienteService');

  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }


  async create(createPacienteDto: CreatePacienteDto) {
    const existePaciente = await this.findCedula(createPacienteDto.identificacion);

    if (existePaciente) throw new BadRequestException("Ya existe el Paciente")

    try {
      const paciente = this.pacienteRepository.create(createPacienteDto);
      await this.pacienteRepository.save(paciente);
      return paciente;
    } catch (error) {
      if (error.code === '23505') throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async findOne(id: string) {
    const paciente = await this.pacienteRepository.findOneBy({ id });
    if (!paciente) throw new NotFoundException(`Paciente ${id} no encontrado`);
    return paciente;
  }

  async findCedula(identificacion: string) {
    return await this.pacienteRepository.findOneBy({ identificacion });
  }

  async findOneIdUser(usuario: Usuario) {
    const paciente = await this.pacienteRepository.findOneBy({ usuario });
    if (!paciente) throw new NotFoundException(`Paciente  ${usuario} no encontrado`);
    return paciente;
  }

  async update(id: string, updatePacienteDto: UpdatePacienteDto) {
    const paciente = await this.pacienteRepository.preload({
      id: id,
      ...updatePacienteDto,
    });
    if (!paciente) throw new NotFoundException(`Paciente ${id} no encontrado`);

    try {
      await this.pacienteRepository.save(paciente);
      return paciente;
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const paciente = await this.findOne(id);

    paciente.status = false;

    if (paciente.usuario)
      await this.usuarioRepository.remove(paciente.usuario);
  }

  async getPacientePorConsultorio(consultorioId: string) {
    return await this.pacienteRepository.createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.consultorio', 'consultorio')
      .where('paciente.consultorio.id = :consultorioId', { consultorioId })
      .andWhere('paciente.status = :status', { status: true })
      .getMany();
  }
}