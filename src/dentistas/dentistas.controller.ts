import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DentistasService } from './dentistas.service';
import { CreateDentistaDto } from './dto/create-dentista.dto';
import { UpdateDentistaDto } from './dto/update-dentista.dto';

@Controller('dentista')
export class DentistasController {
  constructor(private readonly dentistasService: DentistasService) { }

  @Post()
  create(@Body() createDentistaDto: CreateDentistaDto) {
    return this.dentistasService.create(createDentistaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dentistasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDentistaDto: UpdateDentistaDto) {
    return this.dentistasService.update(id, updateDentistaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dentistasService.remove(id);
  }

  @Get('consultorio/:id')
  dentistaByConsultorio(@Param('id') consultorioId: string) {
    return this.dentistasService.dentistaByConsultorio(consultorioId);
  }
}