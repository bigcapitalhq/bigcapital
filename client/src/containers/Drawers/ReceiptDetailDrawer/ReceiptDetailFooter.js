import React from 'react';
import clsx from 'classnames';

import { TotalLines, TotalLine } from 'components';

import ReceiptDrawerCls from 'style/components/Drawers/ReceiptDrawer.module.scss';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

export function ReceiptDetailFooter() {
  const { receipt } = useReceiptDetailDrawerContext();

  return (
    <div className={clsx(ReceiptDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={'Subtotal'}
          value={receipt.amount}
          className={ReceiptDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={'TOTAL'}
          value={receipt.amount}
          className={ReceiptDrawerCls.total_line_total}
        />
        <TotalLine
          title={'Payment made'}
          value={receipt.amount}
          className={ReceiptDrawerCls.total_line_payment}
        />
        <TotalLine
          title={'Due amount'}
          value={'0'}
          className={ReceiptDrawerCls.total_line_dueAmount}
        />
      </TotalLines>
    </div>
  );
}
