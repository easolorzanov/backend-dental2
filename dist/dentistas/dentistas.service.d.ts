import { CreateDentistaDto } from './dto/create-dentista.dto';
import { UpdateDentistaDto } from './dto/update-dentista.dto';
import { Dentista } from './entities/dentista.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
export declare class DentistasService {
    private readonly dentistaRepository;
    private readonly logger;
    constructor(dentistaRepository: Repository<Dentista>);
    create(createDentistaDto: CreateDentistaDto): Promise<Dentista>;
    findCedula(identificacion: string): Promise<Dentista>;
    findOne(id: string): Promise<Dentista>;
    findOneIdUser(usuario: Usuario): Promise<Dentista>;
    update(id: string, updateDentistaDto: UpdateDentistaDto): Promise<Dentista>;
    remove(id: string): Promise<void>;
    dentistaByConsultorio(consultorioId: string): Promise<Dentista[]>;
    getEspecialidades(): Promise<string[]>;
}
