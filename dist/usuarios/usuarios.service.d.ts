import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
export declare class UsuariosService {
    private readonly usuarioRepository;
    private readonly logger;
    constructor(usuarioRepository: Repository<Usuario>);
    create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>;
    hashPassword(password: string): Promise<string>;
    findByUsername(username: string): Promise<Usuario>;
    findById(id: string): Promise<Usuario>;
    findAll(): Promise<Usuario[]>;
    findOne(id: string): Promise<Usuario>;
    update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        username: string;
        password: string;
        role: import("../roles/entities/role.entity").Role;
        dentista: import("../dentistas/entities/dentista.entity").Dentista;
        paciente: import("../pacientes/entities/paciente.entity").Paciente;
    }>;
    updatePassword(id: string, newPassword: string): Promise<{
        message: string;
    }>;
}
