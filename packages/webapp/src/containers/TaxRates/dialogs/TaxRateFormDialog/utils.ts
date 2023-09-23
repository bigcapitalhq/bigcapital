// @ts-nocheck
import { useFormikContext } from 'formik';
import * as R from 'ramda';
import { omit } from 'lodash';
import { transformToForm } from '@/utils';

// Default initial form values.
export const defaultInitialValues = {
  name: '',
  code: '',
  rate: '',
  description: '',
  is_compound: false,
  is_non_recoverable: false,
  confirm_edit: false,
};

/**
 * Transformers response errors to form errors.
 * @returns {Record<string, string>}
 */
export const transformApiErrors = (errors) => {
  const fields = {};

  if (errors.find((e) => e.type === 'TAX_CODE_NOT_UNIQUE')) {
    fields.code = 'The tax rate is not unique.';
  }
  return fields;
};

/**
 * Tranformes form values to request values.
 */
export const transformFormToReq = (form) => {
  return omit({ ...form }, ['confirm_edit']);
};

/**
 * Detarmines whether the tax rate changed.
 * @param initialValues 
 * @param formValues 
 * @returns {boolean}
 */
export const isTaxRateChange = (initialValues, formValues) => {
  return initialValues.rate !== formValues.rate;
};

/**
 * Detarmines whether the tax rate changed.
 * @returns {boolean}
 */
export const useIsTaxRateChanged = () => {
  const { initialValues, values } = useFormikContext();

  return isTaxRateChange(initialValues, values);
};

const convertFormAttrsToBoolean = (form) => {
  return {
    ...form,
    is_compound: !!form.is_compound,
    is_non_recoverable: !!form.is_non_recoverable,
  };
};

export const transformTaxRateToForm = (taxRate) => {
  return R.compose(convertFormAttrsToBoolean)({
    ...defaultInitialValues,
    /**
     * We only care about the fields in the form. Previously unfilled optional
     * values such as `notes` come back from the API as null, so remove those
     * as well.
     */
    ...transformToForm(taxRate, defaultInitialValues),
  });
};

export const transformTaxRateCodeValue = (input: string) => {
  // Remove non-alphanumeric characters and spaces using a regular expression
  const cleanedString = input.replace(/\s+/g, '');

  // Convert the cleaned string to uppercase
  const uppercasedString = cleanedString.toUpperCase();

  return uppercasedString;
};
