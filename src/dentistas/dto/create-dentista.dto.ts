import { IsString, IsUUID, IsEmail, ValidateNested,IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

export class CreateDentistaDto {
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
    @IsNotEmpty()
    especialidad: string;
  
    @IsString()
    @IsOptional()
    direccion?: string;
  
    @IsEmail()
    @IsNotEmpty()
    correo: string;
  
    @IsString()
    @IsNotEmpty()
    celular: string;

    @IsNotEmpty()
    @Type(() => Usuario)
    usuario: Usuario;
}
