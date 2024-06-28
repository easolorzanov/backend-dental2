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
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      const hash = await this.hashPassword(createUsuarioDto.password);
      const usuario = this.usuarioRepository.create({ ...createUsuarioDto, password: hash });
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      //console.log(error);
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
    return await this.usuarioRepository.findOneBy( {username:username});
  }

  async findById(id: string) {
    return await this.usuarioRepository.findOneBy( {id:id});
  }


  async findAll() {
    const usuarios = await this.usuarioRepository.find();
    return usuarios
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.preload({
      id: id,
      ...updateUsuarioDto,
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    //console.log(usuario)
    try {
      if(updateUsuarioDto.password==null){
        delete usuario.password
        return await this.usuarioRepository.update(id, usuario);
      }else{
        const hash = await this.hashPassword(usuario.password);
        const user = { ...usuario, password: hash };
        await this.usuarioRepository.update(id, user);
        return {"message":"Actualizado Correctamente"}
      }
    

    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: string) {
    const usuario= await  this.findOne(id);
    this.usuarioRepository.remove(usuario)
    return {...usuario, id};
  }
}
