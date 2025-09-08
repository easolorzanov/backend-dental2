import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
import { Consultorio } from './entities/consultorio.entity';
import { Repository } from 'typeorm';
export declare class ConsultorioService {
    private readonly consultorioRepository;
    constructor(consultorioRepository: Repository<Consultorio>);
    create(createConsultorioDto: CreateConsultorioDto): Promise<CreateConsultorioDto & Consultorio>;
    findAll(): Promise<Consultorio[]>;
    findOne(id: number): string;
    update(id: number, updateConsultorioDto: UpdateConsultorioDto): string;
    remove(id: number): string;
}
