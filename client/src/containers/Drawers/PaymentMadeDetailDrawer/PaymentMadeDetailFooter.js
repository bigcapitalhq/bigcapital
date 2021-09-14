import React from 'react';
import clsx from 'classnames';

import { T, TotalLines, TotalLine } from 'components';
import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made - Details panel - Footer.
 */
export default function PaymentMadeDetailFooter() {
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'payment_made.details.subtotal'} />}
          value={paymentMade.amount}
          className={clsx(PaymentDrawerCls.total_line_subtotal)}
        />
        <TotalLine
          title={<T id={'payment_made.details.total'} />}
          value={paymentMade.formatted_amount}
          className={clsx(PaymentDrawerCls.total_line_total)}
        />
      </TotalLines>
    </div>
  );
}
