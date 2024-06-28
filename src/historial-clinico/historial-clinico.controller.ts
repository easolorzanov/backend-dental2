import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorialClinicoService } from './historial-clinico.service';
import { CreateHistorialClinicoDto } from './dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historial-clinico.dto';

@Controller('historial-clinico')
export class HistorialClinicoController {
  constructor(private readonly historialClinicoService: HistorialClinicoService) {}

  @Post()
  create(@Body() createHistorialClinicoDto: CreateHistorialClinicoDto) {
    return this.historialClinicoService.create(createHistorialClinicoDto);
  }

  @Get()
  findAll() {
    return this.historialClinicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historialClinicoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorialClinicoDto: UpdateHistorialClinicoDto) {
    return this.historialClinicoService.update(+id, updateHistorialClinicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historialClinicoService.remove(+id);
  }
}
