import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UnauthorizedException, Req, UseGuards, ParseIntPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/signup-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/signin-user.dto';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Post('register')
  async register(@Body()body):Promise<UserEntity>
  {
    return this.usersService.create(body);
  }

  @Get()
  findAll():Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string):Promise<UserEntity | null> {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto):Promise<UserEntity>
   {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string):Promise<UserEntity>
 {
    return this.usersService.remove(+id);
  }
}
