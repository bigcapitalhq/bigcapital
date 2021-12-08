import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine, If } from 'components';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';
import { FormatNumber } from '../../../components';

import VendorCreditDetailCls from '../../../style/components/Drawers/VendorCreditDetail.module.scss';

/**
 * Vendor Credit detail panel footer.
 */
export default function VendorCreditDetailDrawerFooter() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();

  return (
    <div className={clsx(VendorCreditDetailCls.detail_panel_footer)}>
      <TotalLines className={clsx(VendorCreditDetailCls.total_lines)}>
        <TotalLine
          title={<T id={'vendor_credit.drawer.label_subtotal'} />}
          value={<FormatNumber value={vendorCredit.formatted_amount} />}
          className={VendorCreditDetailCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'vendor_credit.drawer.label_total'} />}
          value={vendorCredit.formatted_amount}
          className={VendorCreditDetailCls.total_line_total}
        />
      </TotalLines>
    </div>
  );
}
