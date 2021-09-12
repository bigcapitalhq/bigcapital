import React from 'react';
import clsx from 'classnames';

import { T, TotalLine, TotalLines } from 'components';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

import PaymentDrawerCls from './PaymentReceiveDrawer.module.scss';

/**
 * Payment receive detail footer.
 */
export default function PaymentReceiveDetailFooter() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={<T id={'payment_receive.details.subtotal'} />}
          value={paymentReceive.amount}
          className={PaymentDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={<T id={'payment_receive.details.total'} />}
          value={paymentReceive.amount}
          className={PaymentDrawerCls.total_line_total}
        />
      </TotalLines>
    </div>
  );
}
