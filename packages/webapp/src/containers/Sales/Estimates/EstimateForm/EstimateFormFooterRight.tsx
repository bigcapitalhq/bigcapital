import { useFormikContext } from 'formik';
import styled from 'styled-components';
import { AdjustmentTotalLine } from '../../Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '../../Invoices/InvoiceForm/DiscountTotalLine';
import {
  useEstimateAdjustmentFormatted,
  useEstimateDiscountFormatted,
  useEstimateSubtotalFormatted,
  useEstimateTotalFormatted,
} from './utils';
import type { EstimateFormValues } from './utils';
import { T, TotalLines, TotalLine, TotalLineTextStyle } from '@/components';

export function EstimateFormFooterRight() {
  const {
    values: { currencyCode },
  } = useFormikContext<EstimateFormValues>();
  const subtotalFormatted = useEstimateSubtotalFormatted();
  const totalFormatted = useEstimateTotalFormatted();
  const discountAmountFormatted = useEstimateDiscountFormatted();
  const adjustmentAmountFormatted = useEstimateAdjustmentFormatted();

  return (
    <EstimateTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
      <TotalLine
        title={<T id={'estimate_form.label.subtotal'} />}
        value={subtotalFormatted}
      />
      <DiscountTotalLine
        currencyCode={currencyCode}
        discountAmount={discountAmountFormatted}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmountFormatted} />
      <TotalLine
        title={<T id={'estimate_form.label.total'} />}
        value={totalFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </EstimateTotalLines>
  );
}

const EstimateTotalLines = styled(TotalLines)`
  --x-color-text: #555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
