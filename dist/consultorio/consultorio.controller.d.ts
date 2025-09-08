import { ConsultorioService } from './consultorio.service';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
export declare class ConsultorioController {
    private readonly consultorioService;
    constructor(consultorioService: ConsultorioService);
    create(createConsultorioDto: CreateConsultorioDto): Promise<CreateConsultorioDto & import("./entities/consultorio.entity").Consultorio>;
    findAll(): Promise<import("./entities/consultorio.entity").Consultorio[]>;
    findOne(id: string): string;
    update(id: string, updateConsultorioDto: UpdateConsultorioDto): string;
    remove(id: string): string;
}
