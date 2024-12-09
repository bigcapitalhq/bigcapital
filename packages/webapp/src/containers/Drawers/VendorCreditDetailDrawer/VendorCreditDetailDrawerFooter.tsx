// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import {
  T,
  TotalLines,
  TotalLine,
  TotalLineBorderStyle,
  TotalLineTextStyle,
} from '@/components';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';

/**
 * Vendor Credit detail panel footer.
 */
export default function VendorCreditDetailDrawerFooter() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();

  return (
    <VendorCreditFooterRoot>
      <VendorCreditTotalLines labelColWidth={'180px'} amountColWidth={'180px'}>
        <TotalLine
          title={<T id={'vendor_credit.drawer.label_subtotal'} />}
          value={vendorCredit.formatted_subtotal}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        {vendorCredit?.discount_amount_formatted && (
          <TotalLine
            title={
              vendorCredit.discount_percentage_formatted
                ? `Discount [${vendorCredit.discount_percentage_formatted}]`
                : 'Discount'
            }
            value={vendorCredit.discount_amount_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        {vendorCredit?.adjustment_formatted && (
          <TotalLine
            title={'Adjustment'}
            value={vendorCredit.adjustment_formatted}
            textStyle={TotalLineTextStyle.Regular}
          />
        )}
        <TotalLine
          title={<T id={'vendor_credit.drawer.label_total'} />}
          value={vendorCredit.total_formatted}
          borderStyle={TotalLineBorderStyle.DoubleDark}
          textStyle={TotalLineTextStyle.Bold}
        />
      </VendorCreditTotalLines>
    </VendorCreditFooterRoot>
  );
}

export const VendorCreditFooterRoot = styled.div``;

export const VendorCreditTotalLines = styled(TotalLines)`
  margin-left: auto;
`;
