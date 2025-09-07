import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Length,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class ServicioRealizadoDto {
  @IsString()
  @IsNotEmpty()
  servicioId: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber()
  @IsOptional()
  costo?: number;

  @IsString()
  @IsOptional()
  notas?: string;
}

export class CompleteCitaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  observacion: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  recomendacion: string;

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  diagnostico?: string;

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  tratamiento?: string;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  medicamentos?: string;

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  instrucciones?: string;

  @IsNumber()
  @IsOptional()
  duracion_real?: number; // Duración real en minutos

  @IsBoolean()
  @IsOptional()
  paciente_asistio?: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  motivo_no_asistencia?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicioRealizadoDto)
  @IsOptional()
  servicios_realizados?: ServicioRealizadoDto[];

  @IsNumber()
  @IsOptional()
  total_cobrado?: number;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  metodo_pago?: string;

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  proxima_cita?: string; // Fecha sugerida para próxima cita

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  urgencia?: string; // Nivel de urgencia si aplica
}
