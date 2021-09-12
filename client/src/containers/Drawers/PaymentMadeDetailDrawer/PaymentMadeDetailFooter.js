import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine } from 'components';
import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

/**
 * Payment made - Details panel - Footer.
 */
export default function PaymentMadeDetailFooter() {

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'payment_made.details.subtotal'} />}
          value={1000}
          className={clsx(PaymentDrawerCls.total_line_subtotal)}
        />
        <TotalLine
          title={<T id={'payment_made.details.total'} />}
          value={1000}
          className={clsx(PaymentDrawerCls.total_line_total)}
        />
      </TotalLines>
    </div>
  );
}
