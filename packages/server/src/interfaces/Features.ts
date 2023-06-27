export enum Features {
  WAREHOUSES = 'warehouses',
  BRANCHES = 'branches',
}

export interface IFeatureAllItem {
  name: string;
  isAccessible: boolean;
  defaultAccessible: boolean;
}

export interface IFeatureConfiguration {
  name: string;
  defaultValue?: boolean;
}
