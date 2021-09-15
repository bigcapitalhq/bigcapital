import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { FormatDate, DetailsMenu, DetailItem } from 'components';

import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

import ReceiptDrawerCls from 'style/components/Drawers/ReceiptDrawer.module.scss';

/**
 * receipt detail content.
 */
export default function ReceiptDetailHeader() {
  const { receipt } = useReceiptDetailDrawerContext();

  return (
    <div className={clsx(ReceiptDrawerCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <h3 class="big-number">{receipt.formatted_amount}</h3>
        </DetailItem>
        <DetailItem
          label={intl.get('receipt.details.receipt_number')}
          children={defaultTo(receipt.receipt_number, '-')}
        />
        <DetailItem
          label={intl.get('customer_name')}
          children={receipt.customer?.display_name}
        />
        <DetailItem
          label={intl.get('receipt_date')}
          children={<FormatDate value={receipt.receipt_date} />}
        />
        <DetailItem
          label={intl.get('closed_date')}
          children={<FormatDate value={receipt.closed_at_date} />}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'}>
        <DetailItem
          label={intl.get('deposit_account')}
          children={receipt.deposit_account?.name}
        />
        <DetailItem
          label={intl.get('reference')}
          children={defaultTo(receipt.reference_no, '--')}
        />
        <DetailItem
          label={intl.get('receipt.details.created_at')}
          children={<FormatDate value={receipt.created_at} />}
        />
      </DetailsMenu>
    </div>
  );
}
