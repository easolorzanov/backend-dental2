import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  IsDateString,
  IsOptional
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

  @IsNotEmpty()
  servicios: Servicio[];

  @IsNumber()
  @IsNotEmpty()
  total_pagar: number;

  @IsString()
  @Length(1, 1000)
  @IsOptional()
  observacion: string;

  @IsString()
  @Length(1, 1000)
  @IsOptional()
  recomendacion: string;
  
}