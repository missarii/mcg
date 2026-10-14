import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const header: string = req.headers?.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new UnauthorizedException('Missing admin token');
    try {
      const payload = await this.jwt.verifyAsync(token);
      if (payload?.role !== 'admin') throw new Error('not admin');
      req.admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid admin token');
    }
  }
}
