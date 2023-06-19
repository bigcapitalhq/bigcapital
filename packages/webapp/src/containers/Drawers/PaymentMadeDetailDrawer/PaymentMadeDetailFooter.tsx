// @ts-nocheck
import React from 'react';

import {
  T,
  CommercialDocFooter,
  DetailsMenu,
  If,
  DetailItem,
} from '@/components';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';

/**
 * Payment made - Details panel - Footer.
 */
export function PaymentMadeDetailFooter() {
  const { paymentMade } = usePaymentMadeDetailContext();

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
        <If condition={paymentMade.statement}>
          <DetailItem label={<T id={'payment_made.details.statement'} />}>
            {paymentMade.statement}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
