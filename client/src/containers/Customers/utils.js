import React from 'react';
import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { formatMessage } from 'services/intl';

export const transformErrors = (errors) => {
  if (errors.some((e) => e.type === 'CUSTOMER.HAS.SALES_INVOICES')) {
    AppToaster.show({
      message: formatMessage({
        id: 'customer_has_sales_invoices',
      }),
      intent: Intent.DANGER,
    });
  }
  if (
    errors.find((error) => error.type === 'SOME.CUSTOMERS.HAVE.SALES_INVOICES')
  ) {
    AppToaster.show({
      message: formatMessage({
        id: 'some_customers_have_sales_invoices',
      }),
      intent: Intent.DANGER,
    });
  }
};
