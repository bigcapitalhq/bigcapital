import { defaultTo } from 'lodash';
import { Inject, Service } from 'typedi';
import { omit } from 'lodash';
import { FeaturesSettingsDriver } from './FeaturesSettingsDriver';
import { FeaturesConfigureManager } from './FeaturesConfigureManager';
import { IFeatureAllItem } from '@/interfaces';

@Service()
export class FeaturesManager {
  @Inject()
  private drive: FeaturesSettingsDriver;

  @Inject()
  private configure: FeaturesConfigureManager;

  /**
   * Turns-on the given feature name.
   * @param   {number} tenantId
   * @param   {string} feature
   * @returns {Promise<void>}
   */
  public turnOn(tenantId: number, feature: string) {
    return this.drive.turnOn(tenantId, feature);
  }

  /**
   * Turns-off the given feature name.
   * @param   {number} tenantId
   * @param   {string} feature
   * @returns {Promise<void>}
   */
  public turnOff(tenantId: number, feature: string) {
    return this.drive.turnOff(tenantId, feature);
  }

  /**
   * Determines the given feature name is accessible.
   * @param   {number} tenantId
   * @param   {string} feature
   * @returns {Promise<void>}
   */
  public async accessible(tenantId: number, feature: string) {
    // Retrieves the feature default accessible value.
    const defaultValue = this.configure.getFeatureConfigure(
      feature,
      'defaultValue'
    );
    const isAccessible = await this.drive.accessible(tenantId, feature);

    return defaultTo(isAccessible, defaultValue);
  }

  /**
   * Retrieves the all features and their accessible value and default value.
   * @param   {number} tenantId
   * @returns
   */
  public async all(tenantId: number): Promise<IFeatureAllItem[]> {
    const all = await this.drive.all(tenantId);

    return all.map((feature: IFeatureAllItem) => {
      const defaultAccessible = this.configure.getFeatureConfigure(
        feature.name,
        'defaultValue'
      );
      const isAccessible = feature.isAccessible;

      return {
        ...feature,
        isAccessible: defaultTo(isAccessible, defaultAccessible),
      };
    });
  }
}
