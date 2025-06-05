import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderService } from 'src/order/order.service';
import dataSource from 'db/data-source';

@Injectable()
export class PaymentService {
  constructor(@InjectRepository(PaymentEntity) private readonly paymentRepository:Repository<PaymentEntity>,
               private readonly orderService:OrderService){}

  async create(createPaymentDto: CreatePaymentDto,currentUser:UserEntity):Promise<PaymentEntity> 
  {
    const order = await this.orderService.findOne(createPaymentDto.orderId);
    const existingPayment = await this.paymentRepository.findOne({
        where: { order: { id: createPaymentDto.orderId } },
   });

  if (existingPayment) {
    throw new BadRequestException('Payment for this order already exists.');
  }

    if(!order) throw new NotFoundException(`Order with id ${createPaymentDto.orderId} Not Found.`);

    const payment = await this.paymentRepository.create(createPaymentDto)
    if(!payment) throw new NotFoundException('Payment Not Suceesfully');
    payment.user=currentUser
    payment.order=order;
    return await this.paymentRepository.save(payment);
  }

  async findAll(query:any)
  {
    const queryBuilder = dataSource.getRepository(PaymentEntity)
       .createQueryBuilder('payment')
       .leftJoin('payment.user','user')
       .leftJoinAndSelect('payment.order','order')
       .addSelect(['user.name','user.email']);

    if(query.method)
    {
      queryBuilder.andWhere("payment.method =:method",{method:query.method})
    }

    if(query.minPrice)
    {
      queryBuilder.andWhere("payment.amount>=:minPrice",{minPrice:query.minPrice})
    }    
     
    if(query.maxPrice)
    {
      queryBuilder.andWhere("payment.amount<=:maxPrice",{maxPrice:query.maxPrice})
    }

     const [payment, totalPayment] = await queryBuilder.getManyAndCount();
     return {payment,totalPayment}
  }

  async findOne(id: number):Promise<PaymentEntity |null>
  {
    return await this.paymentRepository
    .createQueryBuilder('payment')
    .leftJoin('payment.user','user')
    .leftJoinAndSelect('payment.order','order')
    .addSelect(['user.name','user.email'])
    .where('payment.id=:id',{id})
    .getOne();
    
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto):Promise<PaymentEntity>
  {
    const payment = await this.paymentRepository.findOne({where:{id}})
    if(!payment)
    {
      throw new NotFoundException(`Payment with id ${id} Not Found`)
    }
    Object.assign(payment,updatePaymentDto)
    return await this.paymentRepository.save(payment);
  }

  async remove(id: number):Promise<{message:string}> 
  {
    const result = await this.paymentRepository.delete(id);
    if(result.affected)
    {
      throw new NotFoundException(`Payment with id ${id} Not Found.`)
    }
    return {message:'Record deleted Successfully'};
  }
}
