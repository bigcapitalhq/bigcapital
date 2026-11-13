import { useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { RecurringInvoiceFormFields } from './RecurringInvoiceFormFields';
import styles from './RecurringInvoiceFormHeader.module.scss';
import { getRecurringInvoiceTotals } from './utils';
import type { RecurringInvoiceFormValues } from './utils';
import { Group, PageFormBigNumber } from '@/components';
import { formattedAmount } from '@/utils';

/**
 * Recurring invoice form header section.
 */
export function RecurringInvoiceFormHeader() {
  return (
    <Group
      position="apart"
      align={'flex-start'}
      p="25px 32px"
      className={styles.root}
    >
      <RecurringInvoiceFormFields />
      <RecurringInvoiceFormBigTotal />
    </Group>
  );
}

/**
 * Big total of recurring invoice form header.
 * @returns {React.ReactNode}
 */
function RecurringInvoiceFormBigTotal() {
  const { values } = useFormikContext<RecurringInvoiceFormValues>();
  const totals = getRecurringInvoiceTotals(values);

  return (
    <PageFormBigNumber
      label={intl.get('recurring_invoice.field.amount')}
      amount={formattedAmount(totals.total, values.currencyCode)}
    />
  );
}
