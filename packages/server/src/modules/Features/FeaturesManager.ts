import { Injectable } from '@nestjs/common';
import { FeaturesSettingsDriver } from './FeaturesSettingsDriver';
import { IFeatureAllItem } from '@/common/types/Features';

@Injectable()
export class FeaturesManager {
  constructor(
    private drive: FeaturesSettingsDriver,
  ) {}

  /**
   * Turns-on the given feature name.
   * @param {string} feature
   * @returns {Promise<void>}
   */
  public turnOn(feature: string) {
    return this.drive.turnOn(feature);
  }

  /**
   * Turns-off the given feature name.
   * @param {string} feature
   * @returns {Promise<void>}
   */
  public turnOff(feature: string) {
    return this.drive.turnOff(feature);
  }

  /**
   * Detarmines the given feature name is accessible.
   * @param {string} feature
   * @returns {Promise<void>}
   */
  public async accessible(feature: string) {
    return this.drive.accessible(feature);
  }

  /**
   * Retrieves the all features and their accessible value and default value.
   * @returns {Promise<IFeatureAllItem[]>}
   */
  public async all(): Promise<IFeatureAllItem[]> {
    return this.drive.all();
  }
}
