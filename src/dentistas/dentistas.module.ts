import { Module } from '@nestjs/common';
import { DentistasService } from './dentistas.service';
import { DentistasController } from './dentistas.controller';
import { Dentista } from './entities/dentista.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [DentistasController],
  providers: [DentistasService],
  imports:[ TypeOrmModule.forFeature([
    Dentista
  ]) ],
  exports: [DentistasService]
})
export class DentistasModule {}
