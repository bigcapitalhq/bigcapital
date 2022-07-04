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
import { FormatNumber } from '../../../components';

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
          value={<FormatNumber value={vendorCredit.formatted_amount} />}
          borderStyle={TotalLineBorderStyle.SingleDark}
        />
        <TotalLine
          title={<T id={'vendor_credit.drawer.label_total'} />}
          value={vendorCredit.formatted_amount}
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
