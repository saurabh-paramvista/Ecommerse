import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CurrentUser } from 'src/auth/decoratores/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decoratores/roles.decorator';
import { CartEntity } from './entities/cart.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createCartDto: CreateCartDto,@CurrentUser()currentUser:any):Promise<CartEntity> 
  {
    return await this.cartService.create(createCartDto,currentUser);
  }

  @Get()
  async findAll():Promise<CartEntity[]> 
  {
    return await this.cartService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<CartEntity | null> 
  {
    return await this.cartService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto):Promise<CartEntity>
  {
    return await this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string):Promise<{message:string}>
  {
    return await this.cartService.remove(+id);
  }
}
