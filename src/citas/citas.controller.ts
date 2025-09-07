import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller('cita')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get('actualizar-estados')
  actualizarEstados() {
    return this.citasService.actualizarEstadosManual();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Get('dentistaId/:id')
  findByDentista(@Param('id') id: string) {
    return this.citasService.findAllByDentista(id);
  }

  @Get('pacienteId/:id/calendar')
  findByPacienteForCalendar(@Param('id') id: string) {
    return this.citasService.findAllByPacienteForCalendar(id);
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

  @Patch('restore/:id')
  restore(@Param('id') id: string) {
    return this.citasService.restore(id);
  }

  @Patch('/done/:id')
  doneCita(
    @Param('id') id: string,
    @Body() completeCitaDto: any,
  ) {
    return this.citasService.doneCita(id, completeCitaDto);
  }

  @Get('historico-dentista/:id')
  findHistoricDentista(@Param('id') id: string) {
    return this.citasService.findHistoricoDentista(id);
  }

  @Get('historico-paciente/:id')
  findHistoricPaciente(@Param('id') id: string) {
    return this.citasService.findHistoricoPaciente(id);
  }

  @Get('historico-consultorio/:id')
  findHistoricConsultorio(@Param('id') id: string) {
    return this.citasService.findHistoricoConsultorio(id);
  }

  @Get('last-paciente/:id')
  findLastByPaciente(@Param('id') id: string) {
    return this.citasService.findLastByPaciente(id);
  }

  @Get('last-dentista/:id')
  findLastByDentista(@Param('id') id: string) {
    return this.citasService.findLastByDentista(id);
  }

  @Get('proximas-dentista/:id')
  findProximasCitasDentista(@Param('id') id: string) {
    return this.citasService.findProximasCitasDentista(id);
  }

  @Get('historico-admin')
  findHistoricAdmin() {
    return this.citasService.findHistoricoAdmin();
  }

  @Get('proximas-paciente/:id')
  findProximasCitasPaciente(@Param('id') id: string) {
    return this.citasService.findProximasCitasPaciente(id);
  }
}
