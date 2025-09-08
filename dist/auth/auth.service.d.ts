import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RolesService } from 'src/roles/roles.service';
import { PacientesService } from 'src/pacientes/pacientes.service';
import { DentistasService } from 'src/dentistas/dentistas.service';
export declare class AuthService {
    private readonly usuarioService;
    private readonly rolesService;
    private readonly pacientesService;
    private readonly dentistasService;
    private readonly jwtService;
    constructor(usuarioService: UsuariosService, rolesService: RolesService, pacientesService: PacientesService, dentistasService: DentistasService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(data: any): Promise<import("../dentistas/entities/dentista.entity").Dentista | import("../pacientes/entities/paciente.entity").Paciente>;
    private validateRegister;
}
