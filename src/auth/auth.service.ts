import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private usersRepository:Repository<UserEntity>, private readonly usersService:UsersService, private jwtService: JwtService,){}

    async ValidateUser(email:string,password:string):Promise<UserEntity |null>
   {
      const user=await this.usersRepository.findOne({ where: { email }, relations: ['categories'], });
      if(user && await  bcrypt.compare(password,user.password))
      {
         return user;
      }
      return null;
   }

   async login(user:any):Promise<{accessToken:string,refreshToken:string}>
   {
    const payload ={sub:user.id,email:user.email,name:user.name,roles:user.roles};
    const accessToken= this.jwtService.sign(payload,{expiresIn:'30m'});
    const refreshToken= this.jwtService.sign(payload,{expiresIn:'7d'});
    return{accessToken,refreshToken};
   }

   async getNewAccessToken(refreshToken: string): Promise<{ accessToken: string }>
   {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersRepository.findOne(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, name: user.name, roles: user.roles },
        { expiresIn: '15m' }
      );
      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException("Invalid Refresh Token");
    }
  }

async generateJwt(user: UserEntity):Promise<string>
{
  const payload = { sub: user.id, email: user.email, role: user.roles,name:user.name };
  return this.jwtService.signAsync(payload);
}
}
