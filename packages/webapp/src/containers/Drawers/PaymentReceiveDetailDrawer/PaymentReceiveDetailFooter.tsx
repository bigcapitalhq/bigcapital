// @ts-nocheck
import React from 'react';

import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail footer.
 * @returns {React.JSX}
 */
export default function PaymentReceiveDetailFooter() {
  const { paymentReceive } = usePaymentReceiveDetailContext();
  
  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
        <If condition={paymentReceive.statement}>
          <DetailItem label={<T id={'payment_receive.details.statement'} />}>
            {paymentReceive.statement}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
