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

import { useRefundVendorCreditNoteDrawerContext } from './RefundVendorCreditDrawerProvider';

export default function RefundVendorCreditDetailHeader() {
  const { refundVendorTransaction } = useRefundVendorCreditNoteDrawerContext();

  return (
    <CommercialDocHeader>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem
          label={intl.get('date')}
          children={
            <FormatDate value={refundVendorTransaction.formatted_date} />
          }
        />
        <DetailItem label={intl.get('refund_vendor_credit.drawer.label.amount')}>
          <strong>{refundVendorTransaction.formatted_amount}</strong>
        </DetailItem>
        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.vendor_credit_no')}
          children={refundVendorTransaction.vendor_credit?.vendor_credit_number}
        />

        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.deposit_account')}
          children={refundVendorTransaction.deposit_account.name}
        />
        <DetailItem label={intl.get('refund_vendor_credit.drawer.label.reference_no')}>
          {defaultTo(refundVendorTransaction.reference_no, '—')}
        </DetailItem>
        <DetailItem label={intl.get('refund_vendor_credit.drawer.label.description')}>
          {defaultTo(refundVendorTransaction.description, '—')}
        </DetailItem>
      </DetailsMenu>
    </CommercialDocHeader>
  );
}
