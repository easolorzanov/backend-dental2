import { Module } from '@nestjs/common';
import { DentistasService } from './dentistas.service';
import { DentistasController } from './dentistas.controller';
import { Dentista } from './entities/dentista.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Dentista, Consultorio
  ])],

  controllers: [DentistasController],
  providers: [DentistasService],

  exports: [DentistasService]
})

export class DentistasModule { }