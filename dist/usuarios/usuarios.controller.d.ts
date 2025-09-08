import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    create(createUsuarioDto: CreateUsuarioDto): Promise<import("./entities/usuario.entity").Usuario>;
    findAll(): Promise<import("./entities/usuario.entity").Usuario[]>;
    findOne(id: string): Promise<import("./entities/usuario.entity").Usuario>;
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
    updatePass(id: string, pass: {
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    findUsername(user: string): Promise<import("./entities/usuario.entity").Usuario>;
}
