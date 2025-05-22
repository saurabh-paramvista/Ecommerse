import { ValidateNested } from "class-validator";
import { CreateShippingDto } from "./create-shipping.dto";
import { Type } from "class-transformer";
import { OrderedProductsDto } from "./order-product.dto";

export class CreateOrderDto 
{
  @Type(()=>CreateShippingDto)
  @ValidateNested()
  shippingAddress:CreateShippingDto;

  @Type(()=>OrderedProductsDto)
  @ValidateNested()
  orderedProducts:OrderedProductsDto[];
}
