import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoreysService } from './categoreys.service';
import { CreateCategoreyDto } from './dto/create-categorey.dto';
import { UpdateCategoreyDto } from './dto/update-categorey.dto';


import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decoratores/roles.decorator';
import { UserEntity, UserRole } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/auth/decoratores/current-user.decorator';
import { CategoreyEntity } from './entities/categorey.entity';

@Controller('categoreys')
export class CategoreysController {
  constructor(private readonly categoreysService: CategoreysService) {}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post()
  async create(@Body() createCategoreyDto:CreateCategoreyDto,@CurrentUser()user:UserEntity):Promise<CategoreyEntity>
  {  
    return await this.categoreysService.create(createCategoreyDto,user);
  }
  
  
  @Get()
  async findAll():Promise<CategoreyEntity[]>
   {
    return await this.categoreysService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<CategoreyEntity | null>
 {
    return await this.categoreysService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoreyDto: UpdateCategoreyDto) 
  {
    return await this.categoreysService.update(+id, updateCategoreyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string)
 {
    return await this.categoreysService.remove(+id);
  }
}
