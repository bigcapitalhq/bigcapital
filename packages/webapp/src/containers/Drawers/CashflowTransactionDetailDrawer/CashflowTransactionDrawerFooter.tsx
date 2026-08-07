// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { CommercialDocFooter, DetailsMenu, DetailItem, T } from '@/components';

export function CashflowTransactionDrawerFooter() {
  const { cashflowTransaction } = useCashflowTransactionDrawerContext();

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem
          label={intl.get('cash_flow.drawer.label.statement')}
          multiline
        >
          {cashflowTransaction.description}
        </DetailItem>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
