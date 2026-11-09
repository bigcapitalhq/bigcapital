import React from 'react';
import intl from 'react-intl-universal';
import { useEstimateDetailDrawerContext } from './EstimateDetailDrawerProvider';
import { CommercialDocFooter, If, DetailsMenu, DetailItem } from '@/components';

/**
 * Estimate details footer.
 */
export function EstimateDetailFooter() {
  const { estimate } = useEstimateDetailDrawerContext();

  if (!estimate) {
    return null;
  }

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={!!estimate.termsConditions}>
          <DetailItem
            label={intl.get('estimate.details.terms_conditions')}
            multiline
          >
            {estimate.termsConditions}
          </DetailItem>
        </If>
        <If condition={!!estimate.note}>
          <DetailItem label={intl.get('estimate.details.note')} multiline>
            {estimate.note}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
