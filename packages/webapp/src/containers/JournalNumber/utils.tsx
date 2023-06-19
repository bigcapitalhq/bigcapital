// @ts-nocheck
import {
  transformToForm,
  optionsMapToArray,
  transformToSnakeCase,
  transactionNumber,
} from '@/utils';
import { omit } from 'lodash';

export const defaultInvoiceNoSettings = {
  nextNumber: '',
  numberPrefix: '',
  autoIncrement: '',
};

export const transformSettingsToForm = (settings) => ({
  ...omit(settings, ['autoIncrement']),
  incrementMode: settings.autoIncrement ? 'auto' : 'manual',
});

export const transformFormToSettings = (values, group) => {
  const options = transformToSnakeCase({
    ...transformToForm(values, defaultInvoiceNoSettings),
    autoIncrement: values.incrementMode === 'auto',
  });
  return optionsMapToArray(options).map((option) => ({ ...option, group }));
};

/**
 * Transaction number returns auto-increment if the increment mode is auto or
 * returns empty string if the increment mode is manually or returns the entered 
 * manual text if the increment mode is manual once just in this transaction.  
 */
export const transformValuesToForm = (values) => {
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
