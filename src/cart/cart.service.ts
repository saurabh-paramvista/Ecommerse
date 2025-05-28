import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CartService {

  constructor(@InjectRepository(CartEntity) private readonly cartRepository:Repository<CartEntity>,
              private readonly productService:ProductsService){}

  async create(createCartDto: CreateCartDto,currentUser):Promise<CartEntity>
  {
    const product = await  this.productService.findOne(createCartDto.productId);
    if(!product)
    {
       throw new NotFoundException(`Product with id ${createCartDto.productId} not Found`)
    }
    const cart = this.cartRepository.create(createCartDto);
    cart.addedBy=currentUser;
    cart.products=product;
    return await this.cartRepository.save(cart);
  }

  async findAll():Promise<CartEntity[]>
  {
    return await this.cartRepository.find({relations:{addedBy:true,products:true}});
  }

  async findOne(id: number):Promise<CartEntity |null>
  {
    const cart= await this.cartRepository.findOne({ where: { id },
      relations:{
        addedBy:true,
        products:true,
      }});
      if(!cart)
      {
        throw new NotFoundException(`Cart with id ${id} not found.`)
      }
      return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto):Promise<CartEntity>
   {
    const cart = await this.cartRepository.findOne({where:{id}});
    if(!cart)
    {
      throw new NotFoundException(`Cart with id ${id} not found.`)
    }
    Object.assign(cart,updateCartDto);
  
    return await this.cartRepository.save(cart);
  }

  async remove(id: number):Promise<{message:string}>
   {
    const result = await this.cartRepository.delete(id);
    if (result.affected === 0) 
    {
       throw new NotFoundException(`Cart item with ID ${id} not found`);
    }
    return { message: "Record deleted successfully" };
  }
}
