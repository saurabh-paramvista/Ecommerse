import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto 
{
    @IsNotEmpty({message:'title can not be blank.'})
    @IsString()
    title:string;

    @IsNotEmpty({message:'description cannot be empty.'})
    @IsString()
    description:string;

    @IsNotEmpty({message:'price should not be empty.'})
    @IsNumber({maxDecimalPlaces:2},{message:'price should be number & max decimal precission 2'})
    @IsPositive({message:'price should be a positive'})
    price:number;


    @IsNotEmpty({message:'stock should not be empty.'})
    @IsNumber({},{message:'stock should be a number'})
    @Min(0,{message:'stock can not be negative'})
    stock:number;

    @IsNotEmpty({message:'image should be not empty.'})
    @IsArray({message:'image should be array formate.'})
    images:string[];


    @IsNotEmpty({message:'category should not be empty.'})
    @IsNumber({},{message:'category should be a number.'})
    categoryId:number;


}
