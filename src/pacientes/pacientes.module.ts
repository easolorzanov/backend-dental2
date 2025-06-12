import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { Paciente } from './entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
  imports: [TypeOrmModule.forFeature([
    Paciente, Usuario
  ])],
  exports: [PacientesService]
})

export class PacientesModule { }