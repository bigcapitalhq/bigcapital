import React from 'react';
import clsx from 'classnames';

import { FormatNumber, T, TotalLines, TotalLine } from '../../../components';
import { useBillDrawerContext } from './BillDrawerProvider';

import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';

/**
 * Bill read-only details footer.
 */
export function BillDetailFooter() {
  const { bill } = useBillDrawerContext();

  return (
    <div className={clsx(BillDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'bill.details.subtotal'} />}
          value={<FormatNumber value={bill.amount} />}
          className={BillDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'bill.details.total'} />}
          value={bill.formatted_amount}
          className={BillDrawerCls.total_line_total}
        />
        <TotalLine
          title={<T id={'bill.details.payment_amount'} />}
          value={bill.formatted_payment_amount}
          className={BillDrawerCls.total_line_payment}
        />
        <TotalLine
          title={<T id={'bill.details.due_amount'} />}
          value={bill.formatted_due_amount}
          className={BillDrawerCls.total_line_dueAmount}
        />
      </TotalLines>
    </div>
  );
}
