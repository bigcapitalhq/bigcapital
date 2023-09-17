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

export const transformApiErrors = () => {
  return {};
};

export const transformFormToReq = (form) => {
  return omit({ ...form }, ['confirm_edit']);
};

export const useIsTaxRateChanged = () => {
  const { initialValues, values } = useFormikContext();

  return initialValues.rate !== values.rate;
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
