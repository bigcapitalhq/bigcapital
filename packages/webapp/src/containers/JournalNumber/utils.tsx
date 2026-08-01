import { omit } from 'lodash';
import type {
  OptionEntry,
  ReferenceNumberFormValues,
  SettingsForm,
} from './types';
import {
  transformToForm,
  optionsMapToArray,
  transfromToSnakeCase,
  transactionNumber,
} from '@/utils';

export const defaultInvoiceNoSettings: ReferenceNumberFormValues = {
  incrementMode: 'auto',
  nextNumber: '',
  numberPrefix: '',
  onceManualNumber: '',
};
const defaultReqNoSettings = omit(defaultInvoiceNoSettings, [
  'incrementMode',
  'onceManualNumber',
]);

export const transformSettingsToForm = (
  settings: SettingsForm,
): ReferenceNumberFormValues =>
  ({
    ...omit(settings, ['autoIncrement']),
    incrementMode: settings.autoIncrement ? 'auto' : 'manual',
  }) as ReferenceNumberFormValues;

export const transformFormToSettings = (
  values: ReferenceNumberFormValues,
  group: string,
): OptionEntry[] => {
  const options = transfromToSnakeCase({
    ...transformToForm(values, defaultReqNoSettings),
    autoIncrement: values.incrementMode === 'auto',
  });
  return optionsMapToArray(options).map((option) => ({ ...option, group }));
};

/**
 * Transaction number returns auto-increment if the increment mode is auto or
 * returns empty string if the increment mode is manually or returns the entered
 * manual text if the increment mode is manual once just in this transaction.
 */
export const transformValuesToForm = (
  values: ReferenceNumberFormValues,
): { transactionNumber: string } => {
  const autoIncrementNumber = transactionNumber(
    values.numberPrefix,
    values.nextNumber,
  );
  const _transactionNumber =
    values.incrementMode === 'auto'
      ? autoIncrementNumber
      : values.incrementMode === 'manual-transaction'
        ? values.onceManualNumber
        : '';
  return { transactionNumber: _transactionNumber };
};
