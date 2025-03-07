import { FeaturesConfigureManager } from './FeaturesConfigureManager';
import { Inject, Injectable } from '@nestjs/common';
import { SETTINGS_PROVIDER } from '../Settings/Settings.types';
import { SettingsStore } from '../Settings/SettingsStore';
import { IFeatureAllItem } from '@/common/types/Features';
import { FeaturesConfigure } from './FeaturesConfigure';

@Injectable()
export class FeaturesSettingsDriver {
  constructor(
    private readonly configure: FeaturesConfigureManager,
    private readonly featuresConfigure: FeaturesConfigure,

    @Inject(SETTINGS_PROVIDER)
    private readonly settings: () => SettingsStore,
  ) {}

  /**
   * Turns-on the given feature name.
   * @param {string} feature - The feature name.
   * @returns {Promise<void>}
   */
  async turnOn(feature: string) {
    this.settings().set({ group: 'features', key: feature, value: true });
  }

  /**
   * Turns-off the given feature name.
   * @param {string} feature - The feature name.
   * @returns {Promise<void>}
   */
  async turnOff(feature: string) {
    this.settings().set({ group: 'features', key: feature, value: false });
  }

  /**
   * Detarmines the given feature name is accessible.
   * @param {string} feature - The feature name.
   * @returns {Promise<boolean|null|undefined>}
   */
  async accessible(feature: string) {
    const defaultValue = this.configure.getFeatureConfigure(
      feature,
      'defaultValue',
    );
    const settingValue = this.settings().get(
      { group: 'features', key: feature },
      defaultValue,
    );
    return settingValue;
  }

  /**
   * Retrieves the all features and their accessible value and default value.
   * @returns {Promise<IFeatureAllItem>}
   */
  async all(): Promise<IFeatureAllItem[]> {
    const mappedOpers = this.featuresConfigure.getConfigure().map(async (featureConfigure) => {
      const { name, defaultValue } = featureConfigure;
      const isAccessible = await this.accessible(featureConfigure.name);
      return { name, isAccessible, defaultAccessible: defaultValue };
    });
    return Promise.all(mappedOpers);
  }
}
