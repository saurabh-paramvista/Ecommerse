
import { IsEmail, IsOptional, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
