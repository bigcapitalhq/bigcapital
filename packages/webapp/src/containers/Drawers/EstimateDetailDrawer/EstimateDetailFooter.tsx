// @ts-nocheck
import React from 'react';

import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';

/**
 * Estimate details footer.
 * @returns {React.JSX}
 */
export default function EstimateDetailFooter() {
  const { estimate } = useEstimateDetailDrawerContext();

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={estimate.terms_conditions}>
          <DetailItem
            label={<T id={'estimate.details.terms_conditions'} />}
            multiline
          >
            {estimate.terms_conditions}
          </DetailItem>
        </If>
        <If condition={estimate.note}>
          <DetailItem label={<T id={'estimate.details.note'} />} multiline>
            {estimate.note}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
