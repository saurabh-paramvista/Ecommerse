import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateShippingDto
{
    @IsNotEmpty({message:'phone can not be empty'})
    @IsString({message:'phone should be String'})
    phone:string;


    @IsOptional()
    @IsString({message:'name should be a string'})
    name:string;

    @IsNotEmpty({message:'Address can not be empty'})
    @IsString({message:'Address should be a string'})
    address:string;

    @IsNotEmpty({message:'Address can not be empty'})
    @IsString({message:'Address should be a string'})
    city:string;

    
    @IsNotEmpty({message:'postCode can not be empty'})
    @IsString({message:'postCode should be a string'})
    postCode:string;

    @IsNotEmpty({message:'state can not be empty'})
    @IsString({message:'state should be a string'})
    state:string;

    @IsNotEmpty({message:'country can not be empty'})
    @IsString({message:'country should be a string'})
    country:string;
}