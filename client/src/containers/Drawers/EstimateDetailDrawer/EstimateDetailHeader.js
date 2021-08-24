import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';

import { Card, DetailsMenu, DetailItem } from 'components';

import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

/**
 * Estimate drawer header.
 */
export default function EstimateDetailHeader({}) {
  const {
    estimate: {
      formatted_amount,
      estimate_number,
      formatted_estimate_date,
      formatted_expiration_date,
      customer,
      reference,
    },
  } = useEstimateDetailDrawerContext();

  return (
    <DetailsMenu>
      <Card>
        <div className="details-menu--vertical">
          <DetailItem label={intl.get('amount')}>{formatted_amount}</DetailItem>
          <DetailItem label={intl.get('estimate_number')}>
            {estimate_number}
          </DetailItem>
          <DetailItem label={intl.get('customer_name')}>
            {customer?.display_name}
          </DetailItem>
          <DetailItem label={intl.get('estimate_date')}>
            {formatted_estimate_date}
          </DetailItem>
          <DetailItem label={intl.get('expiration_date')}>
            {formatted_expiration_date}
          </DetailItem>
          <DetailItem label={intl.get('reference')}>
            {defaultTo(reference, '--')}
          </DetailItem>
        </div>
      </Card>
    </DetailsMenu>
  );
}
