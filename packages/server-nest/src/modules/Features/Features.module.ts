import { Module } from '@nestjs/common';
import { FeaturesConfigureManager } from './FeaturesConfigureManager';
import { FeaturesManager } from './FeaturesManager';
import { FeaturesSettingsDriver } from './FeaturesSettingsDriver';
import { FeaturesConfigure } from './FeaturesConfigure';

@Module({
  providers: [
    FeaturesManager,
    FeaturesSettingsDriver,
    FeaturesConfigureManager,
    FeaturesConfigure
  ],
  exports: [FeaturesManager],
})
export class FeaturesModule {}
