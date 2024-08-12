// @ts-nocheck
import React from 'react';
import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';

import { useBillDrawerContext } from './BillDrawerProvider';

/**
 * Bill detail footer.
 * @returns {React.JSX}
 */
export default function BillDetailFooter() {
  const { bill } = useBillDrawerContext();
  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <If condition={bill.note}>
          <DetailItem label={<T id={'note'} />} multiline>
            {bill.note}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
