import React from 'react';
import intl from 'react-intl-universal';
import { useBillDrawerContext } from './BillDrawerProvider';
import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';

/**
 * Bill detail footer.
 * @returns {React.JSX}
 */
export function BillDetailFooter() {
  const { bill } = useBillDrawerContext();
  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={!!bill?.note}>
          <DetailItem label={intl.get('note')} multiline>
            {bill?.note}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
