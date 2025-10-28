import { get } from 'lodash';
import { Injectable } from '@nestjs/common';
import { FeaturesConfigure } from './FeaturesConfigure';

@Injectable()
export class FeaturesConfigureManager {
  constructor(private readonly featuresConfigure: FeaturesConfigure) {}

  /**
   * Retrieves the feature configure.
   * @param {string} featureName
   * @param {string} accessor
   * @returns {IFeatureConfiugration}
   */
  getFeatureConfigure = (featureName: string, accessor?: string) => {
    const meta = this.featuresConfigure.getConfigure().find(
      (feature) => feature.name === featureName
    );
    return accessor ? get(meta, accessor) : meta;
  };
}
