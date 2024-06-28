import { Injectable } from '@nestjs/common';
import { CreateHistorialClinicoDto } from './dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historial-clinico.dto';

@Injectable()
export class HistorialClinicoService {
  create(createHistorialClinicoDto: CreateHistorialClinicoDto) {
    return 'This action adds a new historialClinico';
  }

  findAll() {
    return `This action returns all historialClinico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historialClinico`;
  }

  update(id: number, updateHistorialClinicoDto: UpdateHistorialClinicoDto) {
    return `This action updates a #${id} historialClinico`;
  }

  remove(id: number) {
    return `This action removes a #${id} historialClinico`;
  }
}
