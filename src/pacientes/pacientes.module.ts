import { Module } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { PacientesController } from './pacientes.controller';
import { Paciente } from './entities/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PacientesController],
  providers: [PacientesService],
  imports:[ TypeOrmModule.forFeature([
    Paciente
  ]) ],
  exports: [PacientesService]
})
export class PacientesModule {}
