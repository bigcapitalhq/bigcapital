import React from 'react';
import clsx from 'classnames';

import { TotalLines, TotalLine } from 'components';
import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';
import { useBillDrawerContext } from './BillDrawerProvider';

export function BillDetailFooter() {
  const { bill } = useBillDrawerContext();

  return (
    <div className={clsx(BillDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={'Subtotal'}
          value={bill.amount}
          className={BillDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={'TOTAL'}
          value={bill.amount}
          className={BillDrawerCls.total_line_total}
        />
        <TotalLine
          title={'Payment made'}
          value={bill.payment_amount}
          className={BillDrawerCls.total_line_payment}
        />
        <TotalLine
          title={'Due amount'}
          value={bill.formatted_due_amount}
          className={BillDrawerCls.total_line_dueAmount}
        />
      </TotalLines>
    </div>
  );
}
