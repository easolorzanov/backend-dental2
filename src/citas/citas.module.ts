import { Module } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';

@Module({
  controllers: [CitasController],
  providers: [CitasService],
  imports:[ TypeOrmModule.forFeature([
    Cita
  ]) ],
})
export class CitasModule {}
