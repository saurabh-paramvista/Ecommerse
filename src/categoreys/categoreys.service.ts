import { Injectable } from '@nestjs/common';
import { CreateCategoreyDto } from './dto/create-categorey.dto';
import { UpdateCategoreyDto } from './dto/update-categorey.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoreyEntity } from './entities/categorey.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoreysService {

constructor(@InjectRepository(CategoreyEntity) private readonly categoryRepository:Repository<CategoreyEntity>){}

  async create(createCategoreyDto: CreateCategoreyDto,user:UserEntity):Promise<CategoreyEntity>
  {
    const category = await this.categoryRepository.create(createCategoreyDto);
    category.addedBy = user;
    return this.categoryRepository.save(category)
  }

  async findAll():Promise<CategoreyEntity[]> 
  {
    return await this.categoryRepository.find();
  }

  async findOne(id: number):Promise<CategoreyEntity | null>
  {
    return await  this.categoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoreyDto: UpdateCategoreyDto) 
  {
    return `This action updates a #${id} categorey`;
  }

  async remove(id: number)
  {
    return `This action removes a #${id} categorey`;
  }
}
