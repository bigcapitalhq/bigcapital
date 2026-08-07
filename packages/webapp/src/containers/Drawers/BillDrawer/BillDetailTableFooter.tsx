import styled from 'styled-components';
import { useBillDrawerContext } from './BillDrawerProvider';
import {
  TotalLineBorderStyle,
  TotalLineTextStyle,
  T,
  TotalLines,
  TotalLine,
} from '@/components';

/**
 * Bill read-only details table footer.
 */
export function BillDetailTableFooter() {
  const { bill } = useBillDrawerContext();

  if (!bill) {
    return null;
  }

  return (
    <BillDetailsFooterRoot>
      <BillTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'bill.details.subtotal'} />}
          value={bill.subtotalFormatted}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {(bill.taxes ?? []).map((taxRate) => (
          <TotalLine
            key={taxRate.id}
            title={`${taxRate.name} [${taxRate.taxRate}%]`}
            value={taxRate.taxRateAmountFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        ))}
        {(bill.discountAmount ?? 0) > 0 && (
          <TotalLine
            title={
              bill.discountPercentageFormatted
                ? `Discount [${bill.discountPercentageFormatted}]`
                : 'Discount'
            }
            value={bill.discountAmountFormatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {bill.adjustmentFormatted && (
          <TotalLine title={'Adjustment'} value={bill.adjustmentFormatted} />
        )}
        <TotalLine
          title={<T id={'bill.details.total'} />}
          value={bill.totalFormatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'bill.details.payment_amount'} />}
          value={bill.formattedPaymentAmount}
        />
        <TotalLine
          title={<T id={'bill.details.due_amount'} />}
          value={bill.formattedDueAmount}
          textStyle={TotalLineTextStyle.Bold}
        />
      </BillTotalLines>
    </BillDetailsFooterRoot>
  );
}

export const BillDetailsFooterRoot = styled.div``;

export const BillTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
