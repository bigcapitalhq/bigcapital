import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

interface TransformError {
  type: string;
}

export const transformErrors = (errors: unknown) => {
  if (!Array.isArray(errors)) {
    return;
  }
  const typedErrors = errors as TransformError[];
  if (typedErrors.some((e) => e.type === 'CUSTOMER.HAS.SALES_INVOICES')) {
    AppToaster.show({
      message: intl.get('customer_has_sales_invoices'),
      intent: Intent.DANGER,
    });
  }
  if (
    typedErrors.find(
      (error) => error.type === 'SOME.CUSTOMERS.HAVE.SALES_INVOICES',
    )
  ) {
    AppToaster.show({
      message: intl.get('some_customers_have_sales_invoices'),
      intent: Intent.DANGER,
    });
  }
  if (typedErrors.find((error) => error.type === 'CUSTOMER_HAS_TRANSACTIONS')) {
    AppToaster.show({
      message: intl.get(
        'this_customer_cannot_be_deleted_as_it_is_associated_with_transactions',
      ),
      intent: Intent.DANGER,
    });
  }
};
