import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { FormatDate, T, DetailsMenu, DetailItem } from 'components';
import { useVendorCreditDetailDrawerContext } from './VendorCreditDetailDrawerProvider';

import VendorCreditDetailCls from '../../../style/components/Drawers/VendorCreditDetail.module.scss';

/**
 * Vendor credit detail drawer header.
 */
export default function VendorCreditDetailHeader() {
  const { vendorCredit } = useVendorCreditDetailDrawerContext();
  return (
    <div className={clsx(VendorCreditDetailCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <span class="big-number">{vendorCredit.amount}</span>
        </DetailItem>
        <DetailItem
          label={intl.get('vendor_credit.drawer.label_vendor_credit_no')}
          children={defaultTo(vendorCredit.vendor_credit_number, '-')}
        />
        <DetailItem
          label={intl.get('vendor_name')}
          children={vendorCredit.vendor?.display_name}
        />
        <DetailItem
          label={intl.get('vendor_credit.drawer.label_vendor_credit_date')}
          children={<FormatDate value={vendorCredit.vendor_credit_date} />}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'140px'}>
        <DetailItem
          label={intl.get('note')}
          children={defaultTo(vendorCredit.note, '-')}
        />

        <DetailItem
          label={<T id={'vendor_credit.drawer.label_create_at'} />}
          children={<FormatDate value={vendorCredit.created_at} />}
        />
      </DetailsMenu>
    </div>
  );
}
