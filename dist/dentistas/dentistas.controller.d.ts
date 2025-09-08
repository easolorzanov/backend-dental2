import { DentistasService } from './dentistas.service';
import { CreateDentistaDto } from './dto/create-dentista.dto';
import { UpdateDentistaDto } from './dto/update-dentista.dto';
export declare class DentistasController {
    private readonly dentistasService;
    constructor(dentistasService: DentistasService);
    create(createDentistaDto: CreateDentistaDto): Promise<import("./entities/dentista.entity").Dentista>;
    getEspecialidades(): Promise<string[]>;
    findOne(id: string): Promise<import("./entities/dentista.entity").Dentista>;
    update(id: string, updateDentistaDto: UpdateDentistaDto): Promise<import("./entities/dentista.entity").Dentista>;
    remove(id: string): Promise<void>;
    dentistaByConsultorio(consultorioId: string): Promise<import("./entities/dentista.entity").Dentista[]>;
}
