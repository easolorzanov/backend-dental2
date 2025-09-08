import { Cita } from 'src/citas/entities/cita.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
export declare class Dentista {
    id: string;
    identificacion: string;
    nombre: string;
    apellido: string;
    especialidad: string;
    direccion: string;
    correo: string;
    celular: string;
    usuario: Usuario;
    citas: Cita[];
    consultorio: Consultorio;
}
