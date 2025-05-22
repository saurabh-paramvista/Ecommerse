import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body,@Res({passthrough:true})res:Response):Promise<{message:string}>
  {
    
    const user= await this.authService.ValidateUser(body.email,body.password);
    if (!user) {
    throw new UnauthorizedException('Invalid Credentials');
  }
    const {accessToken, refreshToken } = await this.authService.login(user);
    res.cookie('access_token', accessToken, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
    });

   res.cookie('refresh_token', refreshToken, {
   httpOnly: true,
   maxAge: 7 * 24 * 60 * 60 * 1000,
  });

    return { message: 'Login successful' };

  }

  @Post('referesh')
  async referesh(@Req() req:Request,@Res({passthrough:true})res:Response):Promise<{message:string}>
  {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');


    const newAccessToken= await this.authService.getNewAccessToken(refreshToken);
    res.cookie('access_token',newAccessToken,{
      httpOnly:true,
      maxAge:15*60*1000,
    })
    return {message:'access token refereshed'};
  }

  @Post('logout')
  logout(@Res() res: Response)
  {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
  });
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
