import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine } from 'components';

import ReceiptDrawerCls from 'style/components/Drawers/ReceiptDrawer.module.scss';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

import { FormatNumber } from '../../../components';

/**
 * Receipts read-only details footer.
 */
export function ReceiptDetailFooter() {
  const { receipt } = useReceiptDetailDrawerContext();

  return (
    <div className={clsx(ReceiptDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'receipt.details.subtotal'} />}
          value={<FormatNumber value={receipt.amount} />}
          className={ReceiptDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'receipt.details.total'} />}
          value={receipt.formatted_amount}
          className={ReceiptDrawerCls.total_line_total}
        />
        <TotalLine
          title={<T id={'receipt.details.payment_amount'} />}
          value={receipt.formatted_amount}
          className={ReceiptDrawerCls.total_line_payment}
        />
        <TotalLine
          title={<T id={'receipt.details.due_amount'} />}
          value={'0'}
          className={ReceiptDrawerCls.total_line_dueAmount}
        />
      </TotalLines>
    </div>
  );
}
