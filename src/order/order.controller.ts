import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decoratores/current-user.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoratores/roles.decorator';
import { UpdateOrderStatusDto } from './dto/ipdate-order-status.dto';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto,@CurrentUser() currentUser:UserEntity)
  {
    return  await this.orderService.create(createOrderDto,currentUser);
  }

  @Get()
  async findAll():Promise<OrderEntity[]>
  {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<OrderEntity|null> 
  {
    return  await this.orderService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderStatusDto,@CurrentUser()currentUser:UserEntity):Promise<OrderEntity>
  {
    return this.orderService.update(+id, updateOrderDto,currentUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Put('cancle/:id')
  async cancelled(@Param('id') id:string,@CurrentUser()currentUser:UserEntity):Promise<OrderEntity>
  {
     return this.orderService.cancelled(+id,currentUser)
  }

  @Delete(':id')
  remove(@Param('id') id: string)
  {
    return this.orderService.remove(+id);
  }
}
