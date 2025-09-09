import { IsString, IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export class CreatePacienteDto {
    @IsString()
    @IsNotEmpty()
    identificacion: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsString()
    @IsOptional()
    direccion?: string;

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    celular: string;

    @IsBoolean()
    @IsOptional()
    status?: boolean;

    @IsNotEmpty()
    @Type(() => Usuario)
    usuario: Usuario;

}