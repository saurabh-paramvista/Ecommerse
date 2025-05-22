import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/ipdate-order-status.dto';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderEntity) 
              private readonly orderRepository:Repository<OrderEntity>,
              @InjectRepository(OrdersProductsEntity)
              private readonly orderProductRepository:Repository<OrdersProductsEntity>,
              private readonly productService:ProductsService )
              {}

  async create(createOrderDto: CreateOrderDto,curentUser:UserEntity):Promise<OrderEntity | null> 
  {
     const shippingEntity = new ShippingEntity();
     Object.assign(shippingEntity,createOrderDto.shippingAddress);

     const orderEntity = new OrderEntity();
     orderEntity.shippingAddress=shippingEntity;
     orderEntity.user=curentUser;

     const orderTbl=await this.orderRepository.save(orderEntity)

     let opEntity:{
      order:OrderEntity;
      product:ProductEntity;
      product_quantity:number;
      product_unit_price:number;
     }[]=[];

     for(let i=0;i<createOrderDto.orderedProducts.length;i++)
     {
      const order = orderTbl;
      const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id);
      if (!product) {
        throw new Error(`Product with id ${createOrderDto.orderedProducts[i].id} not found`);
      }
      const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
      const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
      opEntity.push({ order, product, product_quantity, product_unit_price });
     }

     const op =await this.orderProductRepository.createQueryBuilder()
     .insert()
     .into(OrdersProductsEntity)
     .values(opEntity)
     .execute();
    return await this.findOne(orderTbl.id);
  }

  async findAll():Promise<OrderEntity[]> 
  {
    return  await this.orderRepository.find({ 
      relations:{
        shippingAddress:true,
        user:true,
        products:{product:true}
      }
    });;
  }

  async findOne(id: number):Promise<OrderEntity | null> 
  {
    return  await this.orderRepository.findOne({
      where:{id},
      relations:{
        shippingAddress:true,
        user:true,
        products:{product:true}
      }
    });
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto,currentUser:UserEntity):Promise<OrderEntity> 
  {
    let order =await this.findOne(id);

    if(!order) throw new NotFoundException('Order not found exception');

    if((order.status===OrderStatus.CANCELLED) || (order.status===OrderStatus.DELEVERED))
    {
      throw new BadGatewayException(`Order Alradey ${order.status}`)
    }

    if((order.status===OrderStatus.PROCESSING)&&(updateOrderStatusDto.status!=OrderStatus.SHIPPED))
    {
      throw new BadGatewayException('order before shipped')
    }

    if((order.status===OrderStatus.SHIPPED))
    {
      return order
    }

    if(updateOrderStatusDto.status===OrderStatus.SHIPPED)
    {
      order.shippedAt=new Date();
    }

    if(updateOrderStatusDto.status===OrderStatus.DELEVERED)
    {
      order.deliverdAt=new Date();
    }

    order.status=updateOrderStatusDto.status;
    order.updatedBy=currentUser;
    order= await this.orderRepository.save(order)

    if(updateOrderStatusDto.status===OrderStatus.DELEVERED)
    {
       await this.stockUpdate(order,OrderStatus.DELEVERED)
    }
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order:OrderEntity,status:string):Promise<any>
  {
    for(const op of order.products)
    {
      await this.productService.updateStock(op.product.id,op.product_quantity,status)
    }
  }


  async cancelled(id:number,currentUser:UserEntity):Promise<OrderEntity>
  {
     let order=await this.findOne(id);
     if(!order) throw new NotFoundException('order not found')

      if(order.status===OrderStatus.CANCELLED) return order;

      order.status=OrderStatus.CANCELLED;
      order.updatedBy=currentUser;
      order= await this.orderRepository.save(order);
      await this.stockUpdate(order,OrderStatus.CANCELLED);
      return order;
  }
}
