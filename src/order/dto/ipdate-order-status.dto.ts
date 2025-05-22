import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../entities/order.entity";


export class UpdateOrderStatusDto
{
    @IsNotEmpty()
    @IsString()
    @IsIn([OrderStatus.SHIPPED,OrderStatus.DELEVERED])
    status:OrderStatus;
}