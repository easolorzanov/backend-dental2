import { PartialType } from '@nestjs/mapped-types';
import { AuthDTO } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(AuthDTO) {}
