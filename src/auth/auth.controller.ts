import { Controller, Get, Post, Body, Patch, Param, Delete , UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() req: any) {
    return await this.authService.login(req);
  }

  @Post('register')
  async register(@Body() req: any) {
    return this.authService.register(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async test(@Request() req: any) {
    return req.user;
  }
}
