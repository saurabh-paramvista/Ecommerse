import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderedProductsDto
{
    @IsNotEmpty({message:'Product Can not be empty'})
    id:number;

    @IsNumber({maxDecimalPlaces:2},{message:'Price should be a number & max decimal pricession 2'})
    @IsPositive({message:'Price Can not be empty'})
    product_unit_price:number;

    @IsNumber({},{message:'Quantity Should be a number'})
    @IsPositive({message:'Quantity can not be negative'})
    product_quantity:number;
}