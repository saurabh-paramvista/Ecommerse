import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoratores/roles.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decoratores/current-user.decorator';
import { PaymentEntity } from './entities/payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto,@CurrentUser() currentUser:UserEntity):Promise<PaymentEntity>
  {
    return await this.paymentService.create(createPaymentDto,currentUser);
  }

  @Get()
  async findAll(@Query() quary:any)
  {
    return await this.paymentService.findAll(quary);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<PaymentEntity | null>
  {
    return await this.paymentService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto):Promise<PaymentEntity>
  {
    return await this.paymentService.update(+id, updatePaymentDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: string):Promise<{message:string}>
  {
    return await this.paymentService.remove(+id);
  }
}
