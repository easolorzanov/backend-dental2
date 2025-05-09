import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

}
