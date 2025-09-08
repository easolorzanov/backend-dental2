import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
export declare class ServiciosService {
    private readonly servicioRepository;
    private readonly logger;
    constructor(servicioRepository: Repository<Servicio>);
    create(createServicioDto: CreateServicioDto): Promise<Servicio>;
    findAll(consultorioId: string): Promise<Servicio[]>;
    update(id: string, updateServicioDto: UpdateServicioDto): Promise<Servicio>;
    remove(id: string): Promise<void>;
    private findNombre;
}
