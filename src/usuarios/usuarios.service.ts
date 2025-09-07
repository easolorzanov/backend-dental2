import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger('UsuarioService');

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const hash = await this.hashPassword(createUsuarioDto.password);
      const usuario = this.usuarioRepository.create({ ...createUsuarioDto, password: hash });
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      if (error.code === '23505') throw new BadRequestException(error.detail);
      this.logger.error(error);
      throw new InternalServerErrorException('Error no esperado');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async findByUsername(username: string) {
    return await this.usuarioRepository.findOneBy({ username: username });
  }

  async findById(id: string) {
    return await this.usuarioRepository.findOneBy({ id: id });
  }

  async findAll() {
    return await this.usuarioRepository.find();
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.dentista', 'dentista')
      .leftJoinAndSelect('usuario.paciente', 'paciente')
      .where('usuario.id = :id', { id })
      .getOne();

    if (!usuario)
      throw new NotFoundException(`Usuario ${id} no encontrado`);

    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto,
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    try {
      if (updateUsuarioDto.password == null) {
        delete usuario.password;
        await this.usuarioRepository.update(id, usuario);
        return { "message": "Actualizado Correctamente" };
      } else {
        const hash = await this.hashPassword(usuario.password);
        const user = { ...usuario, password: hash };
        await this.usuarioRepository.update(id, user);
        return { "message": "Actualizado Correctamente" };
      }
    } catch (error) {
      this.logger.error('Error actualizando usuario:', error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    this.usuarioRepository.remove(usuario)
    return { ...usuario, id };
  }

  async updatePassword(id: string, newPassword: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);

    if (!newPassword) {
      throw new BadRequestException('La nueva contraseña no puede estar vacía');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    usuario.password = hashedNewPassword;

    try {
      await this.usuarioRepository.save(usuario);
      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error al actualizar la contraseña');
    }
  }

}
