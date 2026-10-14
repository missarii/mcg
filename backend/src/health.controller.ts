import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';

@Controller('api')
export class HealthController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'mcg-backend', time: new Date().toISOString() };
  }
}

function findIndexHtml(): string | null {
  const candidates = [
    join(__dirname, '..', '..', 'dist', 'index.html'), // backend/dist -> /mcg/dist
    join(__dirname, '..', 'dist', 'index.html'), // ts-node backend/src -> /mcg/dist
    join(process.cwd(), 'dist', 'index.html'),
    join(process.cwd(), '..', 'dist', 'index.html'),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

/**
 * SPA fallback: every non-API GET route returns dist/index.html
 * so /, /shop, /admin, /product/:id all work on the single server.
 */
@Controller()
export class SpaController {
  @Get(['/', '/shop', '/about', '/contact', '/admin', '/cart', '/checkout', '/product/:id'])
  spa(@Req() req: Request, @Res() res: Response) {
    const file = findIndexHtml();
    if (file) return res.sendFile(file);
    return res.status(404).send('Frontend dist/index.html not found. Run npm run build first.');
  }
}

