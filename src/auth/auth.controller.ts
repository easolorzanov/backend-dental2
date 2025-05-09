import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signin')
  async login(@Body() req: any) {
    return await this.authService.login(req);
  }

  @Post('signup')
  async register(@Body() req: any) {
    return this.authService.register(req);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  async test(@Request() req: any) {
    return req.user;
  }

}