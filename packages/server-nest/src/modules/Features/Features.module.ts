import { Module } from '@nestjs/common';
import { FeaturesConfigureManager } from './FeaturesConfigureManager';
import { FeaturesManager } from './FeaturesManager';
import { FeaturesSettingsDriver } from './FeaturesSettingsDriver';

@Module({
  providers: [
    FeaturesManager,
    FeaturesSettingsDriver,
    FeaturesConfigureManager,
  ],
  exports: [FeaturesManager],
})
export class FeaturesModule {}
