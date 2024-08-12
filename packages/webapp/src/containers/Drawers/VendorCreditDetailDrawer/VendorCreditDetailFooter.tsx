// @ts-nocheck
import React from 'react';
import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';

export function VendorCreditDetailFooter() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'150px'}>
        <If condition={vendorCredit.note}>
          <DetailItem
            label={<T id={'note'} />}
            children={vendorCredit.note}
            multiline
          />
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
