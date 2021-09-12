import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { DetailsMenu, DetailItem } from 'components';

import { useBillDrawerContext } from './BillDrawerProvider';
import BillDrawerCls from 'style/components/Drawers/BillDrawer.module.scss';

/**
 * Bill detail header.
 */
export default function BillDetailHeader() {
  const { bill } = useBillDrawerContext();

  return (
    <div className={clsx(BillDrawerCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem
          label={intl.get('amount')}
          children={<h3 class="big-number">{bill.formatted_amount}</h3>}
        />
        <DetailItem
          label={intl.get('bill.details.bill_number')}
          children={defaultTo(bill.bill_number, '-')}
        />
        <DetailItem
          label={intl.get('bill_date')}
          children={bill.formatted_bill_date}
        />
        <DetailItem
          label={intl.get('vendor_name')}
          children={bill.vendor?.display_name}
        />
        <DetailItem
          label={intl.get('due_date')}
          children={bill.formatted_due_date}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'140px'}>
        <DetailItem
          label={intl.get('due_amount')}
          children={bill.formatted_due_amount}
        />
        <DetailItem
          label={intl.get('reference')}
          children={defaultTo(bill.reference_no, '--')}
        />
        <DetailItem
          label={intl.get('bill.details.created_at')}
          children={'2020 Ang 21'}
        />
      </DetailsMenu>
    </div>
  );
}
