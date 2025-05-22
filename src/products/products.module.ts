import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CategoreysModule } from 'src/categoreys/categoreys.module';
import { ProductEntity } from './entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ProductEntity]),CategoreysModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}
