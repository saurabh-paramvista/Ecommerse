import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),PassportModule.register({defaultStrategy:'jwt'}),
     ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[JwtModule,UsersService]
})
export class UsersModule {}
 