// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import clsx from 'classnames';
import { defaultTo } from 'lodash';

import { DetailsMenu, DetailItem, T } from '@/components';
import { useCustomerDetailsDrawerContext } from './CustomerDetailsDrawerProvider';

import Style from './CustomerDetailsDrawer.module.scss';

/**
 * Customer details header.
 */
export default function CustomerDetailsHeader() {
  const { customer } = useCustomerDetailsDrawerContext();

  return (
    <div className={clsx(Style.root_content)}>
      <DetailsMenu
        direction={'vertical'}
        className={clsx(Style.root_content_primary)}
      >
        <DetailItem
          name={'outstanding-receivable'}
          label={<T id={'customer.drawer.label.outstanding_receivable'} />}
        >
          <h3 class="big-number">{customer.formatted_balance}</h3>
        </DetailItem>

        <DetailItem
          label={<T id={'customer.drawer.label.customer_type'} />}
          name={'type'}
          children={customer?.formatted_customer_type }
        />
        <DetailItem label={<T id={'customer.drawer.label.unused_credits'} />}>
          0
        </DetailItem>
      </DetailsMenu>

      <DetailsMenu direction={'horizontal'} minLabelSize={'175px'}>
        <DetailItem
          label={<T id={'customer.drawer.label.customer_name'} />}
          name={'name'}
        >
          <strong>{customer?.display_name}</strong>
        </DetailItem>

        <DetailItem
          label={<T id={'customer.drawer.label.company_name'} />}
          children={defaultTo(customer?.company_name, '--')}
        />
        <DetailItem
          label={<T id={'customer.drawer.label.email'} />}
          children={defaultTo(customer?.email, '--')}
        />
        <DetailItem label={<T id={'customer.drawer.label.phone_number'} />}>
          <div>{customer?.personal_phone} </div>
          <div>{customer?.work_phone} </div>
        </DetailItem>

        <DetailItem
          label={<T id={'customer.drawer.label.website'} />}
          children={defaultTo(customer?.website, '--')}
        />
        <DetailItem
          label={<T id={'customer.drawer.label.opening_balance'} />}
          children={customer?.formatted_opening_balance}
        />
        <DetailItem
          label={<T id={'customer.drawer.label.opening_balance_at'} />}
          children={customer?.formatted_opening_balance_at}
        />
        <DetailItem
          label={<T id={'customer.drawer.label.currency'} />}
          children={customer?.currency_code}
        />
        <DetailItem
          label={<T id={'customer.drawer.label.note'} />}
          children={defaultTo(customer?.note, '--')}
        />
      </DetailsMenu>
    </div>
  );
}
