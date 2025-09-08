import { Usuario } from 'src/usuarios/entities/usuario.entity';
export declare class Role {
    id: string;
    nombre: string;
    descripcion: string;
    usuarios: Usuario[];
}
