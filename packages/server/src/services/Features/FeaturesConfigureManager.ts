import { get } from 'lodash';
import { Service } from 'typedi';
import { FeaturesConfigure } from './constants';

@Service()
export class FeaturesConfigureManager {
  /**
   *
   * @param featureName
   * @returns
   */
  getFeatureConfigure = (featureName: string, accessor?: string) => {
    const meta = FeaturesConfigure.find(
      (feature) => feature.name === featureName
    );
    return accessor ? get(meta, accessor) : meta;
  };
}
