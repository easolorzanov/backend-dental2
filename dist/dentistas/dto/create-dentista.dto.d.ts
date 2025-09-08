import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Consultorio } from 'src/consultorio/entities/consultorio.entity';
export declare class CreateDentistaDto {
    identificacion: string;
    nombre: string;
    apellido: string;
    especialidad: string;
    direccion: string;
    correo: string;
    celular: string;
    usuario: Usuario;
    consultorio: Consultorio;
}
