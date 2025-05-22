import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto 
{

    @IsNotEmpty({message:'Product should not be empty.'})
    @IsNumber({},{message:'Product Id Should be a Number'})
    productId:number;

    @IsNotEmpty({message:'Ratings Should not be empty.'})
    @IsNumber({},{message:'Rating Should be a Number'})
    ratings:number;

    @IsNotEmpty({message:'Comment Should not be empty.'})
    @IsString({message:'Comment Should be a String.'})
    comment:string;
}
