import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('paciente')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) { }

  @Post()
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Patch(':id') //
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id') //
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(id);
  }

  @Get('consultorio/:id')
  getPacienteByConsultorio(@Param('id') consultorioId: string) {
    return this.pacientesService.getPacientePorConsultorio(consultorioId);
  }

}