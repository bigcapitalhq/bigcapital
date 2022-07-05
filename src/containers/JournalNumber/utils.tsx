import {
  transformToForm,
  optionsMapToArray,
  transfromToSnakeCase,
  transactionNumber,
} from '@/utils';

export const defaultInvoiceNoSettings = {
  nextNumber: '',
  numberPrefix: '',
  autoIncrement: '',
};

export const transformSettingsToForm = (settings) => ({
  ...settings,
  incrementMode: settings.autoIncrement === 'true' ? 'auto' : 'manual',
});

export const transformFormToSettings = (values, group) => {
  const options = transfromToSnakeCase({
    ...transformToForm(values, defaultInvoiceNoSettings),
    autoIncrement: values.incrementMode === 'auto',
  });
  return optionsMapToArray(options).map((option) => ({ ...option, group }));
};

export const transformValuesToForm = (values) => {
  const incrementNumber =
    values.incrementMode === 'auto'
      ? transactionNumber(values.numberPrefix, values.nextNumber)
      : values.manualTransactionNo;

  const manually = values.incrementMode === 'auto' ? false : true;

  return { incrementNumber, manually };
};
