import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Role } from 'src/roles/entities/role.entity';
export declare class Usuario {
    id: string;
    username: string;
    password: string;
    role: Role;
    dentista: Dentista;
    paciente: Paciente;
}
