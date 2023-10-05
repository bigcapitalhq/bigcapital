// @ts-nocheck
import styled from 'styled-components';
import {
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { useBillAggregatedTaxRates, useBillTotals } from './utils';
import { useFormikContext } from 'formik';
import { TaxType } from '@/interfaces/TaxRates';

export function BillFormFooterRight() {
  const {
    formattedSubtotal,
    formattedTotal,
    formattedDueTotal,
    formattedPaymentTotal,
  } = useBillTotals();

  const {
    values: { inclusive_exclusive_tax, currency_code },
  } = useFormikContext();

  const taxEntries = useBillAggregatedTaxRates();

  return (
    <BillTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={
          <>
            {inclusive_exclusive_tax === TaxType.Inclusive
              ? 'Subtotal (Tax Inclusive)'
              : 'Subtotal'}
          </>
        }
        value={formattedSubtotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      {taxEntries.map((tax, index) => (
        <TotalLine
          key={index}
          title={tax.label}
          value={tax.taxAmountFormatted}
          borderStyle={TotalLineBorderStyle.None}
        />
      ))}
      <TotalLine
        title={`Total (${currency_code})`}
        value={formattedTotal}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={'Paid Amount'}
        value={formattedPaymentTotal}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={'Due Amount'}
        value={formattedDueTotal}
        textStyle={TotalLineTextStyle.Bold}
      />
    </BillTotalLines>
  );
}

const BillTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
