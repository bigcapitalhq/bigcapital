import { Module } from '@nestjs/common';
import { HealthController } from './Health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
