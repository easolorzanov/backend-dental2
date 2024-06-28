import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity';

@Module({
  controllers: [RecetaController],
  providers: [RecetaService],
  imports:[ TypeOrmModule.forFeature([
    Receta
  ]) ],
})
export class RecetaModule {}
