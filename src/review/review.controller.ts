import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decoratores/roles.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decoratores/current-user.decorator';
import { ReviewEntity } from './entities/review.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto,@CurrentUser()currentUser:UserEntity):Promise<ReviewEntity>
   {
    return await this.reviewService.create(createReviewDto,currentUser);
  }

  @Get('/all')
   async findAll():Promise<ReviewEntity[]>
    {
    return await this.reviewService.findAll();
  }

  @Get()
  async findAllByProduct(@Body('productId')productId:number):Promise<ReviewEntity[]>
  {
     return await this.reviewService.findAllByProduct(productId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<ReviewEntity>
   {
    return await this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string):Promise<ReviewEntity> 
  {
    return this.reviewService.remove(+id);
  }
}
