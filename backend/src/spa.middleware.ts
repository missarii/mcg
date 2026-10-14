import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { join } from 'path';
import * as fs from 'fs';

/**
 * SPA fallback: for any non-API GET route, return dist/index.html
 * so React-style page paths (/, /shop, /product/1 ...) work on one server.
 */
@Injectable()
export class SpaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api')) return next();
    if (req.path.startsWith('/assets/') || req.path === '/vite.svg' || req.path === '/favicon.ico') return next();
    if (req.path.includes('.')) return next(); // real static files pass through

    const candidates = [
      join(__dirname, '..', '..', '..', 'dist', 'index.html'),
      join(__dirname, '..', '..', 'dist', 'index.html'),
      join(process.cwd(), 'dist', 'index.html'),
      join(process.cwd(), '..', 'dist', 'index.html'),
    ];
    const file = candidates.find((p) => fs.existsSync(p));
    if (file) return res.sendFile(file);
    return next();
  }
}
