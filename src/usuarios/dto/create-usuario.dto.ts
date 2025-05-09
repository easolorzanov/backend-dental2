import { IsNotEmpty, IsString, Length, MinLength, IsAlphanumeric } from "class-validator";
import { Type } from 'class-transformer';
import { Role } from "src/roles/entities/role.entity";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 30)
    @IsAlphanumeric()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;


    @IsString()
    @IsNotEmpty()
    @Type(() => Role)
    role: Role;
}