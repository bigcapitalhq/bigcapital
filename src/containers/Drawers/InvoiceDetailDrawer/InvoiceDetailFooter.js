import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, FormatNumber, TotalLine } from 'components';
import InvoiceDrawerCls from 'style/components/Drawers/InvoiceDrawer.module.scss';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

/**
 * Invoice details footer.
 */
export function InvoiceDetailFooter() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <div className={clsx(InvoiceDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'invoice.details.subtotal'} />}
          value={<FormatNumber value={invoice.balance} />}
          className={InvoiceDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'invoice.details.total'} />}
          value={invoice.formatted_amount}
          className={InvoiceDrawerCls.total_line_total}
        />
        <TotalLine
          title={<T id={'invoice.details.payment_amount'} />}
          value={invoice.formatted_payment_amount}
          className={InvoiceDrawerCls.total_line_payment}
        />
        <TotalLine
          title={<T id={'invoice.details.due_amount'} />}
          value={invoice.formatted_due_amount}
          className={InvoiceDrawerCls.total_line_dueAmount}
        />
      </TotalLines>
    </div>
  );
}
