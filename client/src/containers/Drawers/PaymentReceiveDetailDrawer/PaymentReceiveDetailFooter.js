import React from 'react';
import clsx from 'classnames';

import { TotalLine, TotalLines } from 'components';
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
          title={'Subtotal'}
          value={paymentReceive.amount}
          className={PaymentDrawerCls.total_line_subtotal}
        />
        <TotalLine
          title={'TOTAL'}
          value={paymentReceive.amount}
          className={PaymentDrawerCls.total_line_total}
        />
      </TotalLines>
    </div>
  );
}
