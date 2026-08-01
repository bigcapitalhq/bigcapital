export type IncrementMode = 'auto' | 'manual' | 'manual-transaction';

export interface ReferenceNumberFormValues {
  incrementMode: IncrementMode;
  numberPrefix: string;
  nextNumber: string;
  onceManualNumber: string;
  [key: string]: unknown;
}

export interface SettingsForm {
  nextNumber?: string | number;
  numberPrefix?: string;
  autoIncrement?: boolean | string;
  [key: string]: unknown;
}

export interface OptionEntry {
  key: string;
  value: unknown;
  group: string;
}
