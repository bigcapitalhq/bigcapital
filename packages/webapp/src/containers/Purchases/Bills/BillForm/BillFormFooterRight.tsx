import { useFormikContext } from 'formik';
import styled from 'styled-components';
import {
  useBillAdjustmentAmountFormatted,
  useBillAggregatedTaxRates,
  useBillDiscountAmountFormatted,
  useBillDueAmountFormatted,
  useBillPaidAmountFormatted,
  useBillSubtotalFormatted,
  useBillTotalFormatted,
  type BillFormValues,
} from './utils';
import {
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { Features } from '@/constants';
import { AdjustmentTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/DiscountTotalLine';
import { useFeatureCan } from '@/hooks/state';
import { TaxType } from '@/interfaces/TaxRates';

export function BillFormFooterRight() {
  const {
    values: { inclusiveExclusiveTax, currencyCode },
  } = useFormikContext<BillFormValues>();

  const { featureCan } = useFeatureCan();
  const isSalesTaxFeatureCan = featureCan(Features.SalesTax);

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
            {isSalesTaxFeatureCan && inclusiveExclusiveTax === TaxType.Inclusive
              ? 'Subtotal (Tax Inclusive)'
              : 'Subtotal'}
          </>
        }
        value={subtotalFormatted}
      />
      <DiscountTotalLine
        currencyCode={currencyCode}
        discountAmount={discountAmount}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmount} />
      {isSalesTaxFeatureCan &&
        taxEntries.map(
          (
            tax: { label: string; taxAmountFormatted: string },
            index: number,
          ) => (
            <TotalLine
              key={index}
              title={tax.label}
              value={tax.taxAmountFormatted}
              borderStyle={TotalLineBorderStyle.None}
            />
          ),
        )}
      <TotalLine
        title={`TOTAL (${currencyCode})`}
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
  --x-color-text: #555;
  --x-color-text: var(--color-light-gray4);

  width: 100%;
  color: var(--x-color-text);
`;
