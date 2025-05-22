import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignInDto } from './dto/signin-user.dto';
import { UserSignUpDto } from './dto/signup-user.dto';

@Injectable()
export class UsersService {
constructor(@InjectRepository(UserEntity) private usersRepository:Repository<UserEntity>, private jwtService: JwtService,){}

  async create(userSignUpDto: UserSignUpDto):Promise<UserEntity>
   {
   const hashedPassword = await bcrypt.hash(userSignUpDto.password, 10);
    const newUser = this.usersRepository.create({...userSignUpDto, password: hashedPassword });
    return this.usersRepository.save(newUser);
  }

  findAll():Promise<UserEntity[]> {
    try{
    return this.usersRepository.find();
    }catch(error)
    {
      throw new InternalServerErrorException(error);
    }
  }

  findOne(id: number):Promise<UserEntity |null> 
  {
    return this.usersRepository.findOne({ where: { id } });
  }

 async update(id: number, updateUserDto: UpdateUserDto):Promise<UserEntity> 
  {
    const user = await this.usersRepository.findOne({where:{id}})
    
    if(!user) throw new NotFoundException('User not found')

      Object.assign(user,updateUserDto)
      return await this.usersRepository.save(user);
  }

  async remove(id: number):Promise<UserEntity>
  {
    const user = await this.usersRepository.findOne({where:{id}})
    if (!user) throw new NotFoundException('User not found');
    return await this.usersRepository.remove(user);
  }

  async findUserByEmail(email:string):Promise<UserEntity | null>
  {
    return await this.usersRepository.findOne({ where: { email } });
  }

}
