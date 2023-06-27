// @ts-nocheck
import React from 'react';
import {
  CommercialDocFooter,
  T,
  If,
  DetailsMenu,
  DetailItem,
} from '@/components';

import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

/**
 * Receipt details footer
 * @returns {React.JSX}
 */
export default function ReceiptDetailFooter() {
  const { receipt } = useReceiptDetailDrawerContext();

  return (
    <CommercialDocFooter>
      <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
        <If condition={receipt.statement}>
          <DetailItem label={<T id={'receipt.details.statement'} />}>
            {receipt.statement}
          </DetailItem>
        </If>
        <If condition={receipt.receipt_message}>
          <DetailItem label={<T id={'receipt.details.receipt_message'} />}>
            {receipt.receipt_message}
          </DetailItem>
        </If>
      </DetailsMenu>
    </CommercialDocFooter>
  );
}
