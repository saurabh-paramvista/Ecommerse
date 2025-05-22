import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoreyDto } from './create-categorey.dto';

export class UpdateCategoreyDto extends PartialType(CreateCategoreyDto) {}
