import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(createServicioDto: CreateServicioDto): Promise<import("./entities/servicio.entity").Servicio>;
    findAll(id: string): Promise<import("./entities/servicio.entity").Servicio[]>;
    update(id: string, updateServicioDto: UpdateServicioDto): Promise<import("./entities/servicio.entity").Servicio>;
    remove(id: string): Promise<void>;
}
