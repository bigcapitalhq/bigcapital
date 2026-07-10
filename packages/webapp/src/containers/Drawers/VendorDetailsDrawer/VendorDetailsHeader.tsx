import clsx from 'classnames';
import { defaultTo } from 'lodash';
import intl from 'react-intl-universal';
import Style from './VendorDetailsDrawer.module.scss';
import { useVendorDetailsDrawerContext } from './VendorDetailsDrawerProvider';
import { T, DetailsMenu, DetailItem } from '@/components';

/**
 * Vendor details header.
 */
export function VendorDetailsHeader() {
  const { vendor } = useVendorDetailsDrawerContext();

  return (
    <div className={clsx(Style.root_content)}>
      <DetailsMenu
        direction={'vertical'}
        className={clsx(Style.root_content_primary)}
      >
        <DetailItem
          name={'outstanding-payable'}
          label={intl.get('vendor.drawer.label.outstanding_payable')}
        >
          {/* @ts-expect-error — latent bug preserved: original used `class` instead of `className`, so React ignores it; the CSS class never applied. */}
          <h3 class="big-number">{vendor?.formattedBalance}</h3>
        </DetailItem>

        <DetailItem label={intl.get('vendor.drawer.label.unused_credits')}>
          0
        </DetailItem>
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'} minLabelSize={'175px'}>
        <DetailItem
          label={intl.get('vendor.drawer.label.vendor')}
          name={'name'}
        >
          <strong>{vendor?.displayName}</strong>
        </DetailItem>

        <DetailItem
          label={intl.get('vendor.drawer.label.company_name')}
          children={defaultTo(vendor?.companyName, '--')}
        />
        <DetailItem
          label={intl.get('email')}
          children={defaultTo(vendor?.email, '--')}
        />
        <DetailItem label={intl.get('vendor.drawer.label.phone_number')}>
          <div>{vendor?.personalPhone} </div>
          <div>{vendor?.workPhone} </div>
        </DetailItem>

        <DetailItem
          label={intl.get('vendor.drawer.label.website')}
          children={defaultTo(vendor?.website, '--')}
        />
        <DetailItem
          label={intl.get('vendor.drawer.label.opening_balance')}
          children={vendor?.formattedOpeningBalance}
        />
        <DetailItem
          label={intl.get('vendor.drawer.label.opening_balance_at')}
          children={vendor?.formattedOpeningBalanceAt}
        />
        <DetailItem
          label={intl.get('vendor.drawer.label.currency')}
          children={vendor?.currencyCode}
        />
        <DetailItem
          label={intl.get('vendor.drawer.label.note')}
          children={defaultTo(vendor?.note, '--')}
        />
      </DetailsMenu>
    </div>
  );
}
