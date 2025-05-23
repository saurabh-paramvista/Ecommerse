import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity} from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoreysService } from 'src/categoreys/categoreys.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/order/entities/order.entity';
import dataSource from 'db/data-source';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(ProductEntity) private readonly productRepository:Repository<ProductEntity>,
  private readonly categoryService:CategoreysService){}

  async create(createProductDto: CreateProductDto,currentUser:UserEntity):Promise<ProductEntity> 
  {

    const category = await this.categoryService.findOne(createProductDto.categoryId);
    if(!category)
    {
       throw new NotFoundException('Category Not Found')
    }
    const product = this.productRepository.create(createProductDto);
    product.category=category;
    product.addedBy=currentUser
    return await this.productRepository.save(product);
  }

  async findAll(quary:any)
   {
    let limit:number;

    if(!quary.limit)
    {
       limit=4;
    }else{
      limit=quary.limit;
    }

    const queryBuilder = dataSource.getRepository(ProductEntity)
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category','category')
    .leftJoin('product.reviews','review')
    .addSelect([
      'COUNT(review.id) AS reviewCount',
      'AVG("review"."ratings")::numeric(10,2) AS avgRating'
    ])
    .groupBy('product.id,category.id')

    const totalProducts = await queryBuilder.getCount();

    if(quary.search)
    {
      const search=quary.search;
      queryBuilder.andWhere("product.title like :title",{title:`%${search}%`})
    }

    if(quary.category)
    {
      queryBuilder.andWhere("category.id=:id",{id:quary.category})
    }

    if(quary.minPrice)
    {
      queryBuilder.andWhere("product.price>=:minPrice",{minPrice:quary.minPrice})
    }

    if(quary.maxPrice)
    {
      queryBuilder.andWhere("product.price<=:maxPrice",{maxPrice:quary.maxPrice})
    }

    if(quary.minRating)
    {
      queryBuilder.andHaving("AVG(review.ratings)>=:minRating",{minRating:quary.minRating})
    }

    if(quary.maxRating)
    {
      queryBuilder.andHaving("AVG(review.ratings)<=:maxRating",{maxRating:quary.maxRating})
    }

    queryBuilder.limit(limit);

    if(quary.offset)
    {
      queryBuilder.offset(quary.offset);
    }

    const products=await queryBuilder.getRawMany();

    return {products:products,totalProducts,limit};
  }

  async findOne(id: number):Promise<ProductEntity | null>
   {
    return await this.productRepository.findOne({
      where:{id:id},
      relations:{
        addedBy:true,
        category:true
      },
      select:{
        addedBy:{
        id:true,
        name:true,
        email:true,
        },
      category:{
        id:true,
        title:true,
      }
      }
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto):Promise<ProductEntity> 
  {

    const product = await this.productRepository.findOne({where:{id}})

    if(!product) throw new NotFoundException('product not found')

    Object.assign(product,updateProductDto)
    return  await this.productRepository.save(product);
  }

  async remove(id: number):Promise<string> 
  {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("product not found exception");
    }
    return `this ${id} Product deleted Successfully `;
  }

  async updateStock(id:number,stock:number,status:string):Promise<ProductEntity>
  {
    let product = await this.findOne(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    if(status === OrderStatus.DELEVERED)
    {
      product.stock -= stock;

    }else{
      
      product.stock += stock;
    }

    product = await this.productRepository.save(product);
    return product;
  }
}
