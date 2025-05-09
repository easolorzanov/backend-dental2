import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller('cita')
export class CitasController {
  constructor(private readonly citasService: CitasService) { }

  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Get('dentistaId/:id')
  findByDentista(@Param('id') id: string) {
    return this.citasService.findAllByDentista(id);
  }

  @Get('pacienteId/:id')
  findByPaciente(@Param('id') id: string) {
    return this.citasService.findAllByPaciente(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(id);
  }

  @Patch('/done/:id')
  doneCita(@Param('id') id: string, @Body() body: { observacion?: string; recomendacion?: string }) {
    const { observacion, recomendacion } = body
    return this.citasService.doneCita(id, observacion, recomendacion);
  }

  @Get('historico-dentista/:id')
  findHistoricDentista(@Param('id') id: string) {
    return this.citasService.findHistoricoDentista(id);
  }

  @Get('last-paciente/:id')
  findLastByPaciente(@Param('id') id: string) {
    return this.citasService.findLastByPaciente(id);
  }
}