import { IsString } from "class-validator";

export class CreateConsultorioDto {
    @IsString()
    nombreConsultorio: string;

    @IsString()
    direccionConsultorio: string;
}