import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { FormatDate, T, DetailsMenu, DetailItem } from 'components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

import EstimateDetailsCls from 'style/components/Drawers/EstimateDetails.module.scss';

/**
 * Estimate read-only details drawer header.
 */
export default function EstimateDetailHeader() {
  const { estimate } = useEstimateDetailDrawerContext();

  return (
    <div className={clsx(EstimateDetailsCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <span class="big-number">{estimate.formatted_amount}</span>
        </DetailItem>
        <DetailItem
          label={intl.get('estimate.details.estimate_number')}
          children={defaultTo(estimate.estimate_number, '-')}
        />
        <DetailItem
          label={intl.get('customer_name')}
          children={estimate.customer?.display_name}
        />
        <DetailItem
          label={intl.get('estimate_date')}
          children={estimate.formatted_estimate_date}
        />
        <DetailItem
          label={intl.get('expiration_date')}
          children={estimate.formatted_expiration_date}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'140px'}>
        <DetailItem
          label={intl.get('reference')}
          children={defaultTo(estimate.reference, '-')}
        />
        <DetailItem
          label={<T id={'estimate.details.created_at'} />}
          children={<FormatDate value={estimate.created_at} />}
        />
      </DetailsMenu>
    </div>
  );
}
