import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';

import {
  Row,
  Col,
  FormatDate,
  DetailsMenu,
  DetailItem,
  CommercialDocHeader,
  CommercialDocTopHeader,
  ButtonLink,
} from 'components';
import { usePaymentReceiveDetailContext } from './PaymentReceiveDetailProvider';

/**
 * Payment receive detail header.
 */
export default function PaymentReceiveDetailHeader() {
  const { paymentReceive } = usePaymentReceiveDetailContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <DetailItem label={intl.get('amount')}>
            <h3 class="big-number">{paymentReceive.formatted_amount}</h3>
          </DetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>

      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem
              label={intl.get('payment_receive.details.payment_number')}
              children={defaultTo(paymentReceive.payment_receive_no, '-')}
            />
            <DetailItem label={intl.get('customer_name')}>
              <ButtonLink>{paymentReceive.customer?.display_name}</ButtonLink>
            </DetailItem>

            <DetailItem
              label={intl.get('deposit_account')}
              children={paymentReceive.deposit_account?.name}
            />
            <DetailItem
              label={intl.get('payment_date')}
              children={<FormatDate value={paymentReceive.payment_date} />}
            />
          </DetailsMenu>
        </Col>

        <Col xs={6}>
          <DetailsMenu
            textAlign={'right'}
            direction={'horizantal'}
            minLabelSize={'180px'}
          >
            <DetailItem
              label={intl.get('description')}
              children={defaultTo(paymentReceive.statement, '—')}
            />
            <DetailItem
              label={intl.get('created_at')}
              children={<FormatDate value={paymentReceive.created_at} />}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}
