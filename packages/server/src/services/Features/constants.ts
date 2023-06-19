import { Features, IFeatureConfiguration } from '@/interfaces';

export const FeaturesConfigure: IFeatureConfiguration[] = [
  {
    name: Features.BRANCHES,
    defaultValue: false,
  },
  {
    name: Features.WAREHOUSES,
    defaultValue: false,
  },
];
