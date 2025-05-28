import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { CategoreysModule } from './categoreys/categoreys.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ReviewModule } from './review/review.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true, // 👈 makes env vars available app-wide
    }),
    TypeOrmModule.forRoot(dataSourceOptions), UsersModule,
     CategoreysModule, AuthModule, ProductsModule, ReviewModule, OrderModule, CartModule, PaymentModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
