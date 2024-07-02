import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

@Module({
  controllers: [CitasController],
  providers: [CitasService],
  imports:[ TypeOrmModule.forFeature([
    Cita,
    Servicio
  ]) ],
})
export class CitasModule {}
