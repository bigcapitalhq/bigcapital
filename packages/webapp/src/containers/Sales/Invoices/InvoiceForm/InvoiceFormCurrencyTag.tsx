import { useFormikContext } from 'formik';
import { useInvoiceIsForeignCustomer } from './utils';
import type { InvoiceFormValues } from './utils';
import { BaseCurrency, BaseCurrencyRoot } from '@/components';

/**
 * Invoice form currency tag.
 */
export function InvoiceFormCurrencyTag() {
  const isForeignCustomer = useInvoiceIsForeignCustomer();
  const {
    values: { currencyCode },
  } = useFormikContext<InvoiceFormValues>();

  if (!isForeignCustomer) {
    return null;
  }
  return (
    <BaseCurrencyRoot>
      <BaseCurrency currency={currencyCode} />
    </BaseCurrencyRoot>
  );
}
