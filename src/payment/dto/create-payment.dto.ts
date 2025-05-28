import { IsArray, IsDecimal, IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsSemVer, IsString } from "class-validator";
import { PaymentStatus } from "../entities/payment.entity";

export class CreatePaymentDto 
{

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    amount:number;

    @IsArray()
    @IsOptional()
    @IsEnum(PaymentStatus,{each:true})
    status?:PaymentStatus[];

    @IsString()
    @IsNotEmpty()
    method:string;

    @IsString()
    @IsNotEmpty()
    transactionId:string;

    @IsInt()
    @IsNotEmpty()
    orderId:number;


}
