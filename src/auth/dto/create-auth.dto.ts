import { IsEmail, IsNotEmpty, IsString, IsArray,IsOptional } from 'class-validator';

export class AuthDTO {

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}