import React from 'react';
import clsx from 'classnames';

import { TotalLines, TotalLine } from 'components';
import InvoiceDrawerCls from 'style/components/Drawers/InvoiceDrawer.module.scss';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 *
 */
export function InvoiceDetailFooter() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <div className={clsx(InvoiceDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={'Subtotal'}
          value={invoice.balance}
          className={InvoiceDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={'TOTAL'}
          value={invoice.balance}
          className={InvoiceDrawerCls.total_line_total}
        />
        <TotalLine
          title={'Payment made'}
          value={invoice.payment_amount}
          className={InvoiceDrawerCls.total_line_payment}
        />
        <TotalLine
          title={'Due amount'}
          value={'1000'}
          className={InvoiceDrawerCls.total_line_dueAmount}
        />
      </TotalLines>
    </div>
  );
}
