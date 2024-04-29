import { Inject, Service } from 'typedi';
import { FeaturesSettingsDriver } from './FeaturesSettingsDriver';
import { IFeatureAllItem } from '@/interfaces';

@Service()
export class FeaturesManager {
  @Inject()
  private drive: FeaturesSettingsDriver;

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
   * Detarmines the given feature name is accessible.
   * @param   {number} tenantId
   * @param   {string} feature
   * @returns {Promise<void>}
   */
  public async accessible(tenantId: number, feature: string) {
    return this.drive.accessible(tenantId, feature);
  }

  /**
   * Retrieves the all features and their accessible value and default value.
   * @param   {number} tenantId
   * @returns {Promise<IFeatureAllItem[]>}
   */
  public async all(tenantId: number): Promise<IFeatureAllItem[]> {
    return this.drive.all(tenantId);
  }
}
