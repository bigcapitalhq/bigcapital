import { Module } from '@nestjs/common';
import { LicenseService } from './License.service';
import { LicenseGuard } from './guards/License.guard';
import { LicenseController } from './License.controller';

@Module({
  controllers: [LicenseController],
  providers: [LicenseService, LicenseGuard],
  exports: [LicenseService, LicenseGuard],
})
export class LicenseModule {}
