import { Consultorio } from "src/consultorio/entities/consultorio.entity";
export declare class CreateServicioDto {
    nombre: string;
    descripcion: string;
    precio: number;
    consultorio?: Consultorio;
}
