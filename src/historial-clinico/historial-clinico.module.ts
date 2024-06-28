import { Module } from '@nestjs/common';
import { HistorialClinicoService } from './historial-clinico.service';
import { HistorialClinicoController } from './historial-clinico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialClinico } from './entities/historial-clinico.entity';

@Module({
  controllers: [HistorialClinicoController],
  providers: [HistorialClinicoService],
  imports:[ TypeOrmModule.forFeature([
    HistorialClinico
  ]) ],
})
export class HistorialClinicoModule {}
