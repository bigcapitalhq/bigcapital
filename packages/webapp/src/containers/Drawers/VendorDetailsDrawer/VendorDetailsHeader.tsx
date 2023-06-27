// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { defaultTo } from 'lodash';

import { T, DetailsMenu, DetailItem } from '@/components';

import { useVendorDetailsDrawerContext } from './VendorDetailsDrawerProvider';

import Style from './VendorDetailsDrawer.module.scss';

/**
 * Vendor details header.
 */
export default function VendorDetailsHeader() {
  const { vendor } = useVendorDetailsDrawerContext();

  return (
    <div className={clsx(Style.root_content)}>
      <DetailsMenu
        direction={'vertical'}
        className={clsx(Style.root_content_primary)}
      >
        <DetailItem
          name={'outstanding-payable'}
          label={<T id={'vendor.drawer.label.outstanding_payable'} />}
        >
          <h3 class="big-number">{vendor.formatted_balance}</h3>
        </DetailItem>

        <DetailItem label={<T id={'vendor.drawer.label.unused_credits'} />}>
          0
        </DetailItem>
      </DetailsMenu>

      <DetailsMenu direction={'horizontal'} minLabelSize={'175px'}>
        <DetailItem
          label={<T id={'vendor.drawer.label.vendor'} />}
          name={'name'}
        >
          <strong>{vendor?.display_name}</strong>
        </DetailItem>

        <DetailItem
          label={<T id={'vendor.drawer.label.company_name'} />}
          children={defaultTo(vendor?.company_name, '--')}
        />
        <DetailItem
          label={intl.get('email')}
          children={defaultTo(vendor.email, '--')}
        />
        <DetailItem label={<T id={'vendor.drawer.label.phone_number'} />}>
          <div>{vendor?.personal_phone} </div>
          <div>{vendor?.work_phone} </div>
        </DetailItem>

        <DetailItem
          label={<T id={'vendor.drawer.label.website'} />}
          children={defaultTo(vendor?.website, '--')}
        />
        <DetailItem
          label={<T id={'vendor.drawer.label.opening_balance'} />}
          children={vendor?.formatted_opening_balance}
        />
        <DetailItem
          label={<T id={'vendor.drawer.label.opening_balance_at'} />}
          children={vendor?.formatted_opening_balance_at}
        />
        <DetailItem
          label={<T id={'vendor.drawer.label.currency'} />}
          children={vendor?.currency_code}
        />
        <DetailItem
          label={<T id={'vendor.drawer.label.note'} />}
          children={defaultTo(vendor?.note, '--')}

        />
      </DetailsMenu>
    </div>
  );
}
