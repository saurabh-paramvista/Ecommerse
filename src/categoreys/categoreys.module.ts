import { Module } from '@nestjs/common';
import { CategoreysService } from './categoreys.service';
import { CategoreysController } from './categoreys.controller';
import { CategoreyEntity } from './entities/categorey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([CategoreyEntity]),UsersModule],
  controllers: [CategoreysController],
  providers: [CategoreysService],
  exports:[CategoreysService]
})
export class CategoreysModule {}
