import React from 'react';
import clsx from 'classnames';

import { TotalLines, TotalLine } from 'components';

import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

import PaymentDrawerCls from './PaymentMadeDrawer.module.scss';

/**
 * Payment made - Details panel - Footer.
 */
export default function PaymentMadeDetailFooter() {
  const { } = usePaymentMadeDetailContext();

  return (
    <div className={clsx(PaymentDrawerCls.detail_panel_footer)}>
      <TotalLines>
        <TotalLine
          title={'Subtotal'}
          value={1000}
          className={clsx(PaymentDrawerCls.total_line_subtotal)}
        />
        <TotalLine
          title={'TOTAL'}
          value={1000}
          className={clsx(PaymentDrawerCls.total_line_total)}
        />
      </TotalLines>
    </div>
  );
}
