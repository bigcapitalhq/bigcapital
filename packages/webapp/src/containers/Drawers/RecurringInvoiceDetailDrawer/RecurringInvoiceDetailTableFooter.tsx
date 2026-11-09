import React from 'react';
import styled from 'styled-components';
import { useRecurringInvoiceDetailDrawerContext } from './RecurringInvoiceDetailDrawerProvider';
import {
  FormattedMessage as T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

/**
 * Recurring invoice details totals footer.
 */
export function RecurringInvoiceDetailTableFooter() {
  const { recurringInvoice } = useRecurringInvoiceDetailDrawerContext();

  if (!recurringInvoice) {
    return null;
  }

  return (
    <RecurringInvoiceDetailsFooterRoot>
      <RecurringInvoiceTotalLines
        labelColWidth={'180px'}
        amountColWidth={'180px'}
      >
        <TotalLine
          title={<T id={'recurring_invoice.details.subtotal'} />}
          value={recurringInvoice.subtotalFormatted}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {(recurringInvoice.taxAmount ?? 0) > 0 && (
          <TotalLine
            title={<T id={'recurring_invoice.details.tax'} />}
            value={recurringInvoice.taxAmountFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {(recurringInvoice.discountAmount ?? 0) > 0 && (
          <TotalLine
            title={<T id={'recurring_invoice.details.discount'} />}
            value={recurringInvoice.discountAmountFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {!!recurringInvoice.adjustment && (
          <TotalLine
            title={<T id={'recurring_invoice.details.adjustment'} />}
            value={recurringInvoice.adjustmentFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        <TotalLine
          title={<T id={'recurring_invoice.details.total'} />}
          value={recurringInvoice.totalFormatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </RecurringInvoiceTotalLines>
    </RecurringInvoiceDetailsFooterRoot>
  );
}

const RecurringInvoiceDetailsFooterRoot = styled.div``;

const RecurringInvoiceTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
