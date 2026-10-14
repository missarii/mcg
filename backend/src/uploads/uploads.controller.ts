import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { AdminGuard } from '../auth/admin.guard';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

function uploadsDir(): string {
  // backend/dist -> /mcg/dist/uploads ; backend/src (ts-node) -> /mcg/dist/uploads
  const candidates = [
    join(__dirname, '..', '..', '..', 'dist', 'uploads'),
    join(__dirname, '..', '..', 'dist', 'uploads'),
    join(process.cwd(), 'dist', 'uploads'),
    join(process.cwd(), '..', 'dist', 'uploads'),
  ];
  // Prefer the real frontend dist (exists after `npm run build`); else fall back to first
  const dir = candidates.find((c) => existsSync(join(c, '..', 'index.html'))) || candidates[0];
  mkdirSync(dir, { recursive: true });
  return dir;
}

function imageFileFilter(_req: any, file: Express.Multer.File, cb: (err: any, ok: boolean) => void) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new BadRequestException('Only JPG, JPEG, PNG and WebP images are allowed.'), false);
  }
  cb(null, true);
}

/**
 * Local image upload storage — same-server architecture.
 * Files land in <root>/dist/uploads and are served statically + via /api/uploads/:file.
 */
@Controller('api/uploads')
export class UploadsController {
  @UseGuards(AdminGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadsDir()),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || '.png';
          const safe = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, safe);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_IMAGE_BYTES },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file received (field name must be "image").');
    return { url: `/uploads/${file.filename}`, filename: file.filename, size: file.size };
  }
}
