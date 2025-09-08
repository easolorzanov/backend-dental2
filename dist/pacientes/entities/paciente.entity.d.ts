import { Cita } from 'src/citas/entities/cita.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
export declare class Paciente {
    id: string;
    identificacion: string;
    nombre: string;
    apellido: string;
    direccion: string;
    correo: string;
    celular: string;
    usuario: Usuario;
    citas: Cita[];
    consultorio: Consultorio;
    status: boolean;
}
