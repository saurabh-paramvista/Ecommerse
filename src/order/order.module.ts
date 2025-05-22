import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports:[TypeOrmModule.forFeature([OrderEntity,ShippingEntity,OrdersProductsEntity]),ProductsModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
