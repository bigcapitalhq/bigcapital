import React from 'react';
import styled from 'styled-components';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';
import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';

/**
 * Receipts read-only details table footer.
 */
export function ReceiptDetailTableFooter() {
  const { receipt } = useReceiptDetailDrawerContext();

  if (!receipt) {
    return null;
  }

  return (
    <ReceiptDetailsFooterRoot>
      <ReceiptTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'receipt.details.subtotal'} />}
          value={receipt.subtotalFormatted}
        />
        {(receipt.discountAmount ?? 0) > 0 && (
          <TotalLine
            title={
              receipt.discountPercentageFormatted
                ? `Discount [${receipt.discountPercentageFormatted}]`
                : 'Discount'
            }
            value={receipt.discountAmountFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {receipt.adjustmentFormatted && (
          <TotalLine
            title={'Adjustment'}
            value={receipt.adjustmentFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        <TotalLine
          title={<T id={'receipt.details.total'} />}
          value={receipt.totalFormatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'receipt.details.payment_amount'} />}
          value={receipt.paidFormatted}
          borderStyle={TotalLineBorderStyle.SingleDark}
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
