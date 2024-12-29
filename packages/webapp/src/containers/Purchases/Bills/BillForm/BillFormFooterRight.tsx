// @ts-nocheck
import styled from 'styled-components';
import { useFormikContext } from 'formik';
import {
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import {
  useBillAdjustmentAmountFormatted,
  useBillAggregatedTaxRates,
  useBillDiscountAmountFormatted,
  useBillDueAmountFormatted,
  useBillPaidAmountFormatted,
  useBillSubtotalFormatted,
  useBillTotalFormatted,
} from './utils';
import { TaxType } from '@/interfaces/TaxRates';
import { AdjustmentTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/DiscountTotalLine';

export function BillFormFooterRight() {
  const {
    values: { inclusive_exclusive_tax, currency_code },
  } = useFormikContext();

  const dueAmountFormatted = useBillDueAmountFormatted();
  const paidAmountFormatted = useBillPaidAmountFormatted();
  const subtotalFormatted = useBillSubtotalFormatted();
  const totalFormatted = useBillTotalFormatted();
  const taxEntries = useBillAggregatedTaxRates();
  const discountAmount = useBillDiscountAmountFormatted();
  const adjustmentAmount = useBillAdjustmentAmountFormatted();

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
        value={subtotalFormatted}
      />
      <DiscountTotalLine
        currencyCode={currency_code}
        discountAmount={discountAmount}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmount} />
      {taxEntries.map((tax, index) => (
        <TotalLine
          key={index}
          title={tax.label}
          value={tax.taxAmountFormatted}
          borderStyle={TotalLineBorderStyle.None}
        />
      ))}
      <TotalLine
        title={`TOTAL (${currency_code})`}
        value={totalFormatted}
        borderStyle={TotalLineBorderStyle.SingleDark}
        textStyle={TotalLineTextStyle.Bold}
      />
      <TotalLine
        title={'Paid Amount'}
        value={paidAmountFormatted}
        borderStyle={TotalLineBorderStyle.None}
      />
      <TotalLine
        title={'Due Amount'}
        value={dueAmountFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </BillTotalLines>
  );
}

const BillTotalLines = styled(TotalLines)`
  width: 100%;
  color: #555555;
`;
