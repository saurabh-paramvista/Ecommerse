import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoreyDto 
{

    @IsNotEmpty({message:'title cannot be empty'})
    @IsString({message:'title must should be string'})
    title:string;

    @IsNotEmpty({message:'description not be empty'})
    @IsString({message:'description must should be string'})
    description:string
}
