import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/auth/decoratores/current-user.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decoratores/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
    
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)  
  @Post()
  async create(@Body() createProductDto: CreateProductDto,@CurrentUser()user:UserEntity):Promise<ProductEntity>
  {
    return await this.productsService.create(createProductDto,user);
  }

  @Get()
  async findAll():Promise<ProductEntity[]> 
  {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<ProductEntity | null> 
  {
    return await this.productsService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto):Promise<ProductEntity> 
  {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string):Promise<string> 
  {
    return await this.productsService.remove(+id);
  }
}
