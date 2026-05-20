export interface SettingsState {
  data: Record<string, unknown>;
}

export type SettingOption = {
  key: string;
  group: string;
  value: unknown;
};

export type SettingAction = {
  type: string;
  options?: Array<SettingOption>;
  payload?: { group: string; key: string; value: unknown };
};

export const SETTING_LIST_SET = 'SETTING_LIST_SET' as const;
export const CLEAR_OPTIONS_FORM_ERRORS = 'CLEAR_OPTIONS_FORM_ERRORS' as const;
export const SETTING_SET = 'SETTING_SET' as const;
export const SETTING_ADD = 'SETTING_ADD' as const;
