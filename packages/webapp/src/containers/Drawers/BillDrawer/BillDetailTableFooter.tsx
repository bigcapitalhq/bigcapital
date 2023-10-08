// @ts-nocheck
import styled from 'styled-components';
import {
  TotalLineBorderStyle,
  TotalLineTextStyle,
  T,
  TotalLines,
  TotalLine,
} from '@/components';
import { useBillDrawerContext } from './BillDrawerProvider';

/**
 * Bill read-only details table footer.
 */
export function BillDetailTableFooter() {
  const { bill } = useBillDrawerContext();

  return (
    <BillDetailsFooterRoot>
      <BillTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'bill.details.subtotal'} />}
          value={bill.subtotal_formatted}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {bill.taxes.map((taxRate) => (
          <TotalLine
            key={taxRate.id}
            title={`${taxRate.name} [${taxRate.tax_rate}%]`}
            value={taxRate.tax_rate_amount_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        ))}
        <TotalLine
          title={<T id={'bill.details.total'} />}
          value={bill.total_formatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
        <TotalLine
          title={<T id={'bill.details.payment_amount'} />}
          value={bill.formatted_payment_amount}
        />
        <TotalLine
          title={<T id={'bill.details.due_amount'} />}
          value={bill.formatted_due_amount}
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
