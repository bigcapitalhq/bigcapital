import { Module } from '@nestjs/common';
import { DashboardService } from './Dashboard.service';
import { FeaturesModule } from '../Features/Features.module';
import { DashboardController } from './Dashboard.controller';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule, FeaturesModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
