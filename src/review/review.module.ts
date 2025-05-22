import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsModule } from 'src/products/products.module';
import { ReviewEntity } from './entities/review.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ReviewEntity]),ProductsModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
