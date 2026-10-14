import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('api/auth')
export class AuthController {
  constructor(private jwt: JwtService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    const user = process.env.ADMIN_USER || 'orange';
    const pass = process.env.ADMIN_PASS || '123';
    if (body.username !== user || body.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwt.sign({ username: user, role: 'admin' });
    return { access_token: token, username: user };
  }
}
