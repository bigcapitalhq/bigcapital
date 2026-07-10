import clsx from 'classnames';
import { defaultTo } from 'lodash';
import intl from 'react-intl-universal';
import Style from './CustomerDetailsDrawer.module.scss';
import { useCustomerDetailsDrawerContext } from './CustomerDetailsDrawerProvider';
import { DetailsMenu, DetailItem, T } from '@/components';

/**
 * Customer details header.
 */
export function CustomerDetailsHeader() {
  const { customer } = useCustomerDetailsDrawerContext();

  return (
    <div className={clsx(Style.root_content)}>
      <DetailsMenu
        direction={'vertical'}
        className={clsx(Style.root_content_primary)}
      >
        <DetailItem
          name={'outstanding-receivable'}
          label={intl.get('customer.drawer.label.outstanding_receivable')}
        >
          {/* @ts-expect-error — latent bug preserved: original used `class` instead of `className`, so React ignores it; the CSS class never applied. */}
          <h3 class="big-number">{customer?.formattedBalance}</h3>
        </DetailItem>

        <DetailItem
          label={intl.get('customer.drawer.label.customer_type')}
          name={'type'}
          children={customer?.formattedCustomerType}
        />
        <DetailItem label={intl.get('customer.drawer.label.unused_credits')}>
          0
        </DetailItem>
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'175px'}>
        <DetailItem
          label={intl.get('customer.drawer.label.customer_name')}
          name={'name'}
        >
          <strong>{customer?.displayName}</strong>
        </DetailItem>

        <DetailItem
          label={intl.get('customer.drawer.label.company_name')}
          children={defaultTo(customer?.companyName, '--')}
        />
        <DetailItem
          label={intl.get('customer.drawer.label.email')}
          children={defaultTo(customer?.email, '--')}
        />
        <DetailItem label={intl.get('customer.drawer.label.phone_number')}>
          <div>{customer?.personalPhone} </div>
          <div>{customer?.workPhone} </div>
        </DetailItem>

        <DetailItem
          label={intl.get('customer.drawer.label.website')}
          children={defaultTo(customer?.website, '--')}
        />
        <DetailItem
          label={intl.get('customer.drawer.label.opening_balance')}
          children={customer?.formattedOpeningBalance}
        />
        <DetailItem
          label={intl.get('customer.drawer.label.opening_balance_at')}
          children={customer?.formattedOpeningBalanceAt}
        />
        <DetailItem
          label={intl.get('customer.drawer.label.currency')}
          children={customer?.currencyCode}
        />
        <DetailItem
          label={intl.get('customer.drawer.label.note')}
          children={defaultTo(customer?.note, '--')}
        />
      </DetailsMenu>
    </div>
  );
}
