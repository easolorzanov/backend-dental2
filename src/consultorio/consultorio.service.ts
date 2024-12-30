import { Injectable } from '@nestjs/common';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultorio } from './entities/consultorio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConsultorioService {

  constructor(
    @InjectRepository(Consultorio) private readonly consultorioRepository: Repository<Consultorio>
  )
  {}

  async create(createConsultorioDto: CreateConsultorioDto) {
    return await this.consultorioRepository.save(createConsultorioDto)
  }

  async findAll() {
    return await this.consultorioRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} consultorio`;
  }

  update(id: number, updateConsultorioDto: UpdateConsultorioDto) {
    return `This action updates a #${id} consultorio`;
  }

  remove(id: number) {
    return `This action removes a #${id} consultorio`;
  }
}
