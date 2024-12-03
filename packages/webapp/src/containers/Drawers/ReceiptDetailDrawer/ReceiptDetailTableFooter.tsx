// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
  FormatNumber,
} from '@/components';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

/**
 * Receipts read-only details table footer.
 */
export default function ReceiptDetailTableFooter() {
  const { receipt } = useReceiptDetailDrawerContext();

  return (
    <ReceiptDetailsFooterRoot>
      <ReceiptTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'receipt.details.subtotal'} />}
          value={receipt.subtotal_formatted}
        />
        {receipt.discount_amount > 0 && (
          <TotalLine
            title={
              receipt.discount_percentage_formatted
                ? `Discount [${invoice.discount_percentage_formatted}]`
                : 'Discount'
            }
            value={receipt.discount_amount_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {receipt.adjustment > 0 && (
          <TotalLine
            title={'Adjustment'}
            value={receipt.adjustment_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        <TotalLine
          title={<T id={'receipt.details.total'} />}
          value={receipt.total_formatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'receipt.details.payment_amount'} />}
          value={receipt.formatted_amount}
          borderStyle={TotalLineBorderStyle.DoubleDark}
        />
        <TotalLine
          title={<T id={'receipt.details.due_amount'} />}
          value={'0'}
        />
      </ReceiptTotalLines>
    </ReceiptDetailsFooterRoot>
  );
}

export const ReceiptDetailsFooterRoot = styled.div``;

export const ReceiptTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
