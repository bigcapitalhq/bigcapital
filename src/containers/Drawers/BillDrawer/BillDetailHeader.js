import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import styled from 'styled-components';

import {
  FormatDate,
  DetailsMenu,
  DetailItem,
  ButtonLink,
  Row,
  Col,
  CommercialDocHeader,
  CommercialDocTopHeader,
} from 'components';

import { useBillDrawerContext } from './BillDrawerProvider';
import { BillDetailsStatus } from './utils';

/**
 * Bill detail header.
 */
export default function BillDetailHeader() {
  const { bill } = useBillDrawerContext();

  return (
    <CommercialDocHeader>
      <CommercialDocTopHeader>
        <DetailsMenu>
          <AmountDetailItem label={intl.get('amount')}>
            <h3 class="big-number">{bill.formatted_amount}</h3>
          </AmountDetailItem>
          <StatusDetailItem>
            <BillDetailsStatus bill={bill} />
          </StatusDetailItem>
        </DetailsMenu>
      </CommercialDocTopHeader>
      <Row>
        <Col xs={6}>
          <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
            <DetailItem label={intl.get('bill_date')}>
              <FormatDate value={bill.bill_date} />
            </DetailItem>
            <DetailItem label={intl.get('due_date')}>
              <FormatDate value={bill.due_date} />
            </DetailItem>
            <DetailItem label={intl.get('vendor_name')}>
              <ButtonLink>{bill.vendor?.display_name}</ButtonLink>
            </DetailItem>
            <DetailItem label={intl.get('bill.details.bill_number')}>
              {defaultTo(bill.bill_number, '-')}
            </DetailItem>
          </DetailsMenu>
        </Col>
        <Col xs={6}>
          <DetailsMenu
            direction={'horizantal'}
            minLabelSize={'140px'}
            textAlign={'right'}
          >
            <DetailItem label={intl.get('due_amount')}>
              <strong>{bill.formatted_due_amount}</strong>
            </DetailItem>
            <DetailItem
              label={intl.get('reference')}
              children={defaultTo(bill.reference_no, '--')}
            />
            <DetailItem
              label={intl.get('bill.details.created_at')}
              children={<FormatDate value={bill.created_at} />}
            />
          </DetailsMenu>
        </Col>
      </Row>
    </CommercialDocHeader>
  );
}

const StatusDetailItem = styled(DetailItem)`
  width: 50%;
  text-align: right;
  position: relative;
  top: -5px;
`;

const AmountDetailItem = styled(DetailItem)`
  width: 50%;
`;
