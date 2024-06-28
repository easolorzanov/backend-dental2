import { PartialType } from '@nestjs/mapped-types';
import { CreateDentistaDto } from './create-dentista.dto';

export class UpdateDentistaDto extends PartialType(CreateDentistaDto) {}
