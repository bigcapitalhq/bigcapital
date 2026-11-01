import { Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { TaxRateFormValues } from './utils';
import { Alert } from '@/components';

export function TaxRateFormDialogFormErrors() {
  const { errors } = useFormikContext<TaxRateFormValues>();

  if (!errors.confirmEdit) return null;

  return <Alert intent={Intent.DANGER}>{errors.confirmEdit}</Alert>;
}
