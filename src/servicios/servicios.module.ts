import { Module } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';

@Module({
  controllers: [ServiciosController],
  providers: [ServiciosService],
  imports: [TypeOrmModule.forFeature([
    Servicio
  ])],
})

export class ServiciosModule { }