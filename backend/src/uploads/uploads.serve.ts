import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AdminGuard } from '../auth/admin.guard';

function uploadsDir(): string {
  const candidates = [
    join(__dirname, '..', '..', '..', 'dist', 'uploads'),
    join(__dirname, '..', '..', 'dist', 'uploads'),
    join(process.cwd(), 'dist', 'uploads'),
    join(process.cwd(), '..', 'dist', 'uploads'),
  ];
  const dir = candidates.find((c) => existsSync(join(c, '..', 'index.html'))) || candidates[0];
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Explicit file route so /uploads/* resolves from the API namespace too. */
@Controller('api/uploads')
export class UploadsServeController {
  @Get(':filename')
  serve(@Param('filename') filename: string, @Res() res: Response) {
    if (filename.includes('/') || filename.includes('..')) return res.status(400).send('Bad filename');
    const file = join(uploadsDir(), filename);
    if (!existsSync(file)) return res.status(404).send('Image not found');
    return res.sendFile(file);
  }
}
