// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';

import {
  CommercialDocHeader,
  FormatDate,
  DetailsMenu,
  DetailItem,
} from '@/components';

import { useRefundCreditNoteDrawerContext } from './RefundCreditNoteDrawerProvider';

export default function RefundCreditNoteDetailHeader() {
  const { refundCreditTransaction } = useRefundCreditNoteDrawerContext();

  return (
    <CommercialDocHeader>
      <DetailsMenu direction={'horizontal'} minLabelSize={'180px'}>
        <DetailItem
          label={intl.get('date')}
          children={
            <FormatDate value={refundCreditTransaction.formatted_date} />
          }
        />
        <DetailItem label={intl.get('refund_credit.drawer.label.amount')}>
          <strong>{refundCreditTransaction.formatted_amount}</strong>
        </DetailItem>
        <DetailItem
          label={intl.get('refund_credit.drawer.label.credit_note_no')}
          children={refundCreditTransaction.credit_note?.credit_note_number}
        />

        <DetailItem
          label={intl.get('refund_credit.drawer.label.withdrawal_account')}
          children={refundCreditTransaction.from_account.name}
        />
        <DetailItem label={intl.get('refund_credit.drawer.label.reference_no')}>
          {defaultTo(refundCreditTransaction.reference_no, '—')}
        </DetailItem>
        <DetailItem label={intl.get('refund_credit.drawer.label.description')}>
          {defaultTo(refundCreditTransaction.description, '—')}
        </DetailItem>
      </DetailsMenu>
    </CommercialDocHeader>
  );
}
