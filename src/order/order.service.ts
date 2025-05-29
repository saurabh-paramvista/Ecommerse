import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
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
              @InjectRepository(ShippingEntity)
              private readonly shippeingRepository:Repository<ShippingEntity>,
              private readonly productService:ProductsService,
              private readonly dataSource:DataSource)
              {}

  async create(createOrderDto: CreateOrderDto,curentUser:UserEntity)
  {

     return await this.dataSource.transaction(async (manager)=>{

      const shippingEntity=manager.create(ShippingEntity,createOrderDto.shippingAddress);
      await manager.save(ShippingEntity,shippingEntity);

      const orderEntity= new OrderEntity();
      orderEntity.shippingAddress=shippingEntity;
      orderEntity.user=curentUser;
      const savedOrder = await  manager.save(OrderEntity,orderEntity);


      const opEntities:{
          
        order:OrderEntity,
        product:ProductEntity,
        product_quantity:number,
        product_unit_price:number

      }[]=[];

      for(const orderedProducts of createOrderDto.orderedProducts)
      {
         const product= await this.productService.findOne(orderedProducts.id)
         if(!product)
         {
           throw new Error(`product with id ${orderedProducts.id} not found`)
         }

         opEntities.push({
          order:savedOrder,
          product,
          product_quantity:orderedProducts.product_quantity,
          product_unit_price:orderedProducts.product_unit_price,
         });

         await manager.createQueryBuilder()
         .insert()
         .into(OrdersProductsEntity)
         .values(opEntities)
         .execute();

         return await manager.findOne(OrderEntity,{
          where:{id:savedOrder.id},
          relations:{
            shippingAddress:true,
            user:true,
            products:{
              product:true
            }
          }
         })
      }

     })

    //without transaction
    //  const shippingEntity = new ShippingEntity();
    //  Object.assign(shippingEntity,createOrderDto.shippingAddress);

    //  const orderEntity = new OrderEntity();
    //  orderEntity.shippingAddress=shippingEntity;
    //  orderEntity.user=curentUser;

    //  const orderTbl=await this.orderRepository.save(orderEntity)

    //  let opEntity:{
    //   order:OrderEntity;
    //   product:ProductEntity;
    //   product_quantity:number;
    //   product_unit_price:number;
    //  }[]=[];

    //  for(let i=0;i<createOrderDto.orderedProducts.length;i++)
    //  {
    //   const order = orderTbl;
    //   const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id);
    //   if (!product) {
    //     throw new Error(`Product with id ${createOrderDto.orderedProducts[i].id} not found`);
    //   }
    //   const product_quantity = createOrderDto.orderedProducts[i].product_quantity;
    //   const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
    //   opEntity.push({ order, product, product_quantity, product_unit_price });
    //  }

    //  const op =await this.orderProductRepository.createQueryBuilder()
    //  .insert()
    //  .into(OrdersProductsEntity)
    //  .values(opEntity)
    //  .execute();
    // return await this.findOne(orderTbl.id);
  }

  async findAll():Promise<OrderEntity[]> 
  {
    return  await this.orderRepository.find({ 
      relations:{
        shippingAddress:true,
        user:true,
        products:{product:true}
      },select:{
        user:{
          id:true,
          name:true,
          email:true
        }
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
      },select:{
        user:{
          id:true,
          name:true,
          email:true
        }
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

    if((order.status===OrderStatus.SHIPPED && updateOrderStatusDto.status===OrderStatus.SHIPPED))
    {
      return order
    }

    if(updateOrderStatusDto.status===OrderStatus.SHIPPED)
    {
      order.shippedAt=new Date();
    }

    if(updateOrderStatusDto.status===OrderStatus.DELEVERED)
    {
      order.deliverdAt= new Date();
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

  async remove(id: number):Promise<any>
  {
    //apply transaction 
     const quaryRunner = await this.dataSource.createQueryRunner();
     await quaryRunner.connect();
     await quaryRunner.startTransaction();

     try
     {
      const order = await quaryRunner.manager.findOne(this.orderRepository.target,{where:{id},
      relations:{
        shippingAddress:true,
        products:{
          product:true
        }
      }})

      if(!order)
      {
         throw new NotFoundException(`Order with id ${id} Not Found.`)
      }

      const shippingAddressId = order.shippingAddress.id;

      if(!order.products || order.products.length===0)
      {
         throw new NotFoundException(`Product Not Found..`)
      }

      for(const op of order.products)
      {
        await quaryRunner.manager.delete(this.orderProductRepository.target,op.id);
      }

      const deleteOrderResult = await quaryRunner.manager.delete(this.orderRepository.target,id)

      if(deleteOrderResult.affected===0)
      {
        throw new NotFoundException(`Order Not Deleted`);
      }

       const isShippingAddressUsed = await quaryRunner.manager.findOne(this.orderRepository.target, {
        where: { shippingAddress: { id: shippingAddressId } },
        relations: { shippingAddress: true },
        });

        if(!isShippingAddressUsed && shippingAddressId)
        {
          await quaryRunner.manager.delete(this.shippeingRepository.target,shippingAddressId);
        }
        await quaryRunner.commitTransaction();
        return `Order with id ${id} Deleted Successfully.`

     }catch(error)
     {
      await quaryRunner.rollbackTransaction();
       throw error;
     }finally
     {
       await quaryRunner.release();
     }

     //without transaction
  //  const order = await this.orderRepository.findOne({where:{id},
  //   relations:{
  //     shippingAddress:true,
  //     products:{
  //       product:true
  //     }}})

  //   if(!order) throw new NotFoundException(`order with id ${id} Not found`)

  //   const shippingAddress = await this.shippeingRepository.findOne({ where: { id: order?.shippingAddress.id }})
  //   if(!shippingAddress) throw new NotFoundException(`shipping with id ${order?.shippingAddress.id} Not Found.`)

  //   const shippindAdressUse = await this.orderRepository.findOne({where:{shippingAddress:{id:order.shippingAddress.id}},
  //     relations:{
  //       shippingAddress:true
  //     }})

  //   if(!shippindAdressUse)
  //     {
  //        await this.shippeingRepository.delete(shippingAddress.id)
  //     } 

  //  if(!order?.products)throw new NotFoundException(`product Not Found.`);
  //  const product = await order?.products.map(p=>this.orderProductRepository.delete(p.id)); 

  //   const orders = await this.orderRepository.delete(id)
  //   if(orders.affected===0)
  //   {
  //     throw new NotFoundException('Order Not deleted.')
  //   }
    
  //   return `Order with id ${id} deleted successfully.`;
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
