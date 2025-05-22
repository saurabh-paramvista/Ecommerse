import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.get<string>('ACCESS_TOKEN_SECRET');
    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // custom extractor from cookie named 'access_token'
          return req?.cookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:process.env.JWT_SECRET!,
    });
  }

  async validate(payload: any): Promise<UserEntity> 
  {
    const user = await this.usersService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
