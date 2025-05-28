import { IsInt, isNotEmpty, IsNotEmpty, IsPositive } from "class-validator";

export class CreateCartDto 
{

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quantity:number;

    @IsInt()
    @IsNotEmpty()
    productId:number;
}
