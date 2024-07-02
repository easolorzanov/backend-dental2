import { IsNotEmpty, IsNumber, IsString, IsOptional,Length, Max,IsEmail,Min ,IsDateString} from "class-validator";

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
  
    @IsNotEmpty()
    @IsNumber()
    duracion: number;
}
