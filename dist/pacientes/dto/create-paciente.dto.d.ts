import { Usuario } from 'src/usuarios/entities/usuario.entity';
export declare class CreatePacienteDto {
    identificacion: string;
    nombre: string;
    apellido: string;
    direccion?: string;
    correo: string;
    celular: string;
    usuario: Usuario;
}
