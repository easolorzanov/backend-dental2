import { IsNotEmpty, IsNumber, IsString, IsOptional,Length, Max,IsEmail,Min,MinLength,IsAlphanumeric, IsArray, ValidateNested } from "class-validator";

import { Type } from 'class-transformer';
import { CreateRoleDto } from "src/roles/dto/create-role.dto";
import { Role } from "src/roles/entities/role.entity";
export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @Length(5,30)
    @IsAlphanumeric()
    username:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;

  
    @IsString()
    @IsNotEmpty()
    @Type(() => Role)
    role:Role;
  
    //@ValidateNested()
    //@Type(() => DentistaDto) // Reemplaza DentistaDto con el nombre de tu DTO para Dentista si es necesario
    //dentista: DentistaDto;
  
    //@ValidateNested()
    //@Type(() => PacienteDto) // Reemplaza PacienteDto con el nombre de tu DTO para Paciente si es necesario
    //paciente: PacienteDto;
}
