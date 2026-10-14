import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsServeController } from './uploads.serve';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UploadsController, UploadsServeController],
})
export class UploadsModule {}
