// @ts-nocheck
import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useRefundCreditNoteDrawerContext } from './RefundCreditNoteDrawerProvider';
import {
  CommercialDocHeader,
  FormatDate,
  DetailsMenu,
  DetailItem,
} from '@/components';

export function RefundCreditNoteDetailHeader() {
  const { refundCreditTransaction } = useRefundCreditNoteDrawerContext();

  return (
    <CommercialDocHeader>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem
          label={intl.get('date')}
          children={
            <FormatDate value={refundCreditTransaction.formattedDate} />
          }
        />
        <DetailItem label={intl.get('refund_credit.drawer.label.amount')}>
          <strong>{refundCreditTransaction.formattedAmount}</strong>
        </DetailItem>
        <DetailItem
          label={intl.get('refund_credit.drawer.label.credit_note_no')}
          children={refundCreditTransaction.creditNote?.creditNoteNumber}
        />

        <DetailItem
          label={intl.get('refund_credit.drawer.label.withdrawal_account')}
          children={refundCreditTransaction.fromAccount.name}
        />
        <DetailItem label={intl.get('refund_credit.drawer.label.reference_no')}>
          {defaultTo(refundCreditTransaction.referenceNo, '—')}
        </DetailItem>
        <DetailItem label={intl.get('refund_credit.drawer.label.description')}>
          {defaultTo(refundCreditTransaction.description, '—')}
        </DetailItem>
      </DetailsMenu>
    </CommercialDocHeader>
  );
}
