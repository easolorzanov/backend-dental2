import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { Paciente } from './entities/paciente.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
export declare class PacientesService {
    private readonly pacienteRepository;
    private readonly usuarioRepository;
    private readonly logger;
    constructor(pacienteRepository: Repository<Paciente>, usuarioRepository: Repository<Usuario>);
    create(createPacienteDto: CreatePacienteDto): Promise<Paciente>;
    findOne(id: string): Promise<Paciente>;
    findCedula(identificacion: string): Promise<Paciente>;
    findOneIdUser(usuario: Usuario): Promise<Paciente>;
    update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<Paciente>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getPacientePorConsultorio(consultorioId: string): Promise<Paciente[]>;
}
