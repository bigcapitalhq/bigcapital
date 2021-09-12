import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine } from 'components';
import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';
import { useBillDrawerContext } from './BillDrawerProvider';

export function BillDetailFooter() {
  const { bill } = useBillDrawerContext();

  return (
    <div className={clsx(BillDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'bill.details.subtotal'} />}
          value={bill.amount}
          className={BillDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'bill.details.total'} />}
          value={bill.amount}
          className={BillDrawerCls.total_line_total}
        />
        <TotalLine
          title={<T id={'bill.details.payment_amount'} />}
          value={bill.payment_amount}
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
