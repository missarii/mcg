import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // NOTE: no global prefix — every controller already declares its own /api/... route.
  // Frontend page routes (/, /shop, /product/:id, ...) are served via SpaMiddleware.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: true });

  // ---- Serve frontend "dist" from the SAME server ----
  // dist lives at ../dist relative to backend/dist (compiled) OR ../dist relative to backend/src (ts-node dev)
  const candidates = [
    join(__dirname, '..', '..', 'dist'), // running from backend/dist -> /mcg/dist
    join(__dirname, '..', 'dist'), // running from backend/src (ts-node) -> /mcg/dist
    join(process.cwd(), 'dist'), // cwd = backend, fallback
    join(process.cwd(), '..', 'dist'), // cwd = backend, fallback to root dist
  ];
  const fs = await import('fs');
  const distPath = candidates.find((p) => fs.existsSync(join(p, 'index.html')));
  if (distPath) {
    console.log(`Serving frontend from: ${distPath}`);
    app.useStaticAssets(distPath);
    // Uploaded product images live in dist/uploads (same-server storage)
    const uploadsPath = join(distPath, 'uploads');
    try {
      const fss = await import('fs');
      fss.mkdirSync(uploadsPath, { recursive: true });
    } catch { /* ignore */ }
    app.useStaticAssets(uploadsPath, { prefix: '/uploads/' });
  } else {
    console.warn('Frontend dist/index.html not found. Run `npm run build` in project root first.');
  }

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  console.log(`Magic Craft Gallery running on http://localhost:${port}`);
  console.log(`API available at http://localhost:${port}/api`);
}
bootstrap();
