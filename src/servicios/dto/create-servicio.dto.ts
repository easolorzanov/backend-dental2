import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Consultorio } from "src/consultorio/entities/consultorio.entity";

export class CreateServicioDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsNumber()
    precio: number;

    @IsString()
    consultorio?: Consultorio;
}