// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  FormatNumber,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice details footer.
 */
export function InvoiceDetailTableFooter() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <InvoiceDetailsFooterRoot>
      <InvoiceTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'invoice.details.subtotal'} />}
          value={invoice.subtotal_formatted}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {invoice?.discount_amount > 0 && (
          <TotalLine
            title={
              invoice.discount_percentage_formatted
                ? `Discount [${invoice.discount_percentage_formatted}]`
                : 'Discount'
            }
            value={invoice.discount_amount_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {invoice?.adjustment_formatted && (
          <TotalLine
            title="Adjustment"
            value={invoice.adjustment_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {invoice?.taxes?.map((taxRate) => (
          <TotalLine
            key={taxRate.id}
            title={`${taxRate.name} [${taxRate.tax_rate}%]`}
            value={taxRate.tax_rate_amount_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        ))}
        <TotalLine
          title={<T id={'invoice.details.total'} />}
          value={invoice.total_formatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'invoice.details.payment_amount'} />}
          value={invoice.payment_amount_formatted}
        />
        <TotalLine
          title={<T id={'invoice.details.due_amount'} />}
          value={invoice.due_amount_formatted}
          textStyle={TotalLineTextStyle.Bold}
        />
      </InvoiceTotalLines>
    </InvoiceDetailsFooterRoot>
  );
}

const InvoiceDetailsFooterRoot = styled.div``;

const InvoiceTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
