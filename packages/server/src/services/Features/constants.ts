import { Features, IFeatureConfiugration } from '@/interfaces';

export const FeaturesConfigure: IFeatureConfiugration[] = [
  {
    name: Features.BRANCHES,
    defaultValue: false,
  },
  {
    name: Features.WAREHOUSES,
    defaultValue: false,
  },
];
