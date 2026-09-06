import { useFormikContext } from 'formik';
import { useEstimateIsForeignCustomer } from './utils';
import type { EstimateFormValues } from './utils';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Estimate form currency tag.
 * @returns
 */
export function EstimateFromCurrencyTag() {
  const isForeignCustomer = useEstimateIsForeignCustomer();
  const {
    values: { currencyCode },
  } = useFormikContext<EstimateFormValues>();

  if (!isForeignCustomer) {
    return null;
  }
  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={currencyCode} />
    </BaseCurrencyRoot>
  );
}
