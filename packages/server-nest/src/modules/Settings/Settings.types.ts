
export interface IOptionDTO {
  key: string;
  value: string;
  group: string;
}

export interface ISettingsDTO {
  options: IOptionDTO[];
}


export const SETTINGS_PROVIDER = 'SETTINGS';