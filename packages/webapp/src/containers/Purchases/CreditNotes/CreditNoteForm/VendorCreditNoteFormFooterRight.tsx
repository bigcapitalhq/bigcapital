import { useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';
import {
  useVendorCreditAdjustmentAmountFormatted,
  useVendorCreditDiscountAmountFormatted,
  useVendorCreditSubtotalFormatted,
  useVendorCreditTotalFormatted,
  type VendorCreditFormValues,
} from './utils';
import { T, TotalLines, TotalLine, TotalLineTextStyle } from '@/components';
import { AdjustmentTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/AdjustmentTotalLine';
import { DiscountTotalLine } from '@/containers/Sales/Invoices/InvoiceForm/DiscountTotalLine';

export function VendorCreditNoteFormFooterRight() {
  const {
    values: { currencyCode },
  } = useFormikContext<VendorCreditFormValues>();
  const totalFormatted = useVendorCreditTotalFormatted();
  const subtotalFormatted = useVendorCreditSubtotalFormatted();

  const discountAmountFormatted = useVendorCreditDiscountAmountFormatted();
  const adjustmentAmountFormatted = useVendorCreditAdjustmentAmountFormatted();

  return (
    <VendorCreditNoteTotalLines
      labelColWidth={'180px'}
      amountColWidth={'180px'}
    >
      <TotalLine
        title={<T id={'vendor_credit_form.label.subtotal'} />}
        value={subtotalFormatted}
      />
      <DiscountTotalLine
        currencyCode={currencyCode}
        discountAmount={discountAmountFormatted}
      />
      <AdjustmentTotalLine adjustmentAmount={adjustmentAmountFormatted} />
      <TotalLine
        title={<T id={'vendor_credit_form.label.total'} />}
        value={totalFormatted}
        textStyle={TotalLineTextStyle.Bold}
      />
    </VendorCreditNoteTotalLines>
  );
}

const VendorCreditNoteTotalLines = styled(TotalLines)`
  --x-color-text: #555;

  .bp4-dark & {
    --x-color-text: var(--color-light-gray4);
  }
  width: 100%;
  color: var(--x-color-text);
`;
