// @ts-nocheck
import { defaultTo } from 'lodash';
import React from 'react';
import intl from 'react-intl-universal';
import { useRefundVendorCreditNoteDrawerContext } from './RefundVendorCreditDrawerProvider';
import {
  CommercialDocHeader,
  FormatDate,
  DetailsMenu,
  DetailItem,
} from '@/components';

export function RefundVendorCreditDetailHeader() {
  const { refundVendorTransaction } = useRefundVendorCreditNoteDrawerContext();

  return (
    <CommercialDocHeader>
      <DetailsMenu direction={'horizantal'} minLabelSize={'180px'}>
        <DetailItem
          label={intl.get('date')}
          children={
            <FormatDate value={refundVendorTransaction.formattedDate} />
          }
        />
        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.amount')}
        >
          <strong>{refundVendorTransaction.formattedAmount}</strong>
        </DetailItem>
        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.vendor_credit_no')}
          children={refundVendorTransaction.vendorCredit?.vendorCreditNumber}
        />

        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.deposit_account')}
          children={refundVendorTransaction.depositAccount.name}
        />
        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.reference_no')}
        >
          {defaultTo(refundVendorTransaction.referenceNo, '—')}
        </DetailItem>
        <DetailItem
          label={intl.get('refund_vendor_credit.drawer.label.description')}
        >
          {defaultTo(refundVendorTransaction.description, '—')}
        </DetailItem>
      </DetailsMenu>
    </CommercialDocHeader>
  );
}
