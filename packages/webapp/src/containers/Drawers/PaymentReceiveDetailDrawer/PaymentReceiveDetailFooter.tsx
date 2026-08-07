import React from 'react';
import intl from 'react-intl-universal';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';
import { CommercialDocFooter, If, DetailsMenu, DetailItem } from '@/components';

/**
 * Payment receive detail footer.
 */
export function PaymentReceiveDetailFooter() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  if (!paymentReceive) {
    return null;
  }
  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={!!paymentReceive.statement}>
          <DetailItem
            label={intl.get('payment_receive.details.statement')}
            multiline
          >
            {paymentReceive.statement}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
