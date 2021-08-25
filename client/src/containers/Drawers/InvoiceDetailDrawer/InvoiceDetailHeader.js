import React from 'react';
import intl from 'react-intl-universal';
import { defaultTo } from 'lodash';
import clsx from 'classnames';

import { DetailsMenu, DetailItem } from 'components';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import InvoiceDrawerCls from 'style/components/Drawers/InvoiceDrawer.module.scss';

/**
 * Invoice detail header.
 */
export default function InvoiceDetailHeader() {
  const { invoice } = useInvoiceDetailDrawerContext();

  return (
    <div className={clsx(InvoiceDrawerCls.detail_panel_header)}>
      <DetailsMenu>
        <DetailItem label={intl.get('amount')}>
          <h3 class="big-number">{invoice.formatted_amount}</h3>
        </DetailItem>
        <DetailItem
          label={intl.get('invoice_no')}
          children={invoice.invoice_no}
        />
        <DetailItem
          label={intl.get('customer_name')}
          children={invoice.customer?.display_name}
        />
        <DetailItem
          label={intl.get('invoice_date')}
          children={invoice.formatted_invoice_date}
        />

        <DetailItem
          label={intl.get('due_date')}
          children={invoice.formatted_due_date}
        />
      </DetailsMenu>

      <DetailsMenu direction={'horizantal'}>
        <DetailItem
          label={intl.get('due_amount')}
          children={invoice.formatted_due_amount}
        />
        <DetailItem
          label={intl.get('reference')}
          children={defaultTo(invoice.reference_no, '--')}
        />
        <DetailItem label={'Created at'} children={'2020 Ang 21'} />
      </DetailsMenu>
    </div>
  );
}
