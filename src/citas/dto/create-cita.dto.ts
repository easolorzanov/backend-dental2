import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsOptional,
    Length,
    Max,
    IsEmail,
    IsDate,
    IsEnum,
    IsUUID,
    IsDateString
  } from 'class-validator';
import { Dentista } from 'src/dentistas/entities/dentista.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';

export class CreateCitaDto {

    @IsNotEmpty()
    @IsDateString()
    fecha: Date;

    @IsString()
    @IsNotEmpty()
    estado: string;

    @IsString()
    @IsNotEmpty()
    paciente: Paciente;
  
    @IsString()
    @IsNotEmpty()
    dentista: Dentista;

    @IsString()
    @IsNotEmpty()
    servicios: Servicio;

    @IsNumber()
    @IsNotEmpty()
    total_pagar: Servicio;
}
