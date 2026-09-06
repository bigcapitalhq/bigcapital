// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { useContactDetailDrawerContext } from './ContactDetailDrawerProvider';
import { Money } from '@/components';
import { DetailItem } from '@/components/Details';

export function ContactDetailList({}) {
  const { contact } = useContactDetailDrawerContext();

  return (
    <div className="details-menu">
      <div className="details-menu--vertical">
        <DetailItem
          label={intl.get('display_name')}
          children={contact.displayName}
        />
        <DetailItem
          label={intl.get('balance')}
          children={
            <Money amount={contact?.balance} currency={contact?.currencyCode} />
          }
        />
      </div>
      <div className="details-menu--horizontal">
        <DetailItem
          label={intl.get('closing_balance')}
          children={
            <Money
              amount={contact.closingBalance}
              currency={contact?.currencyCode}
            />
          }
        />
        <DetailItem
          label={intl.get('contact_type')}
          children={contact.contactType}
        />
        <DetailItem
          label={intl.get('email')}
          children={contact.email ? contact.email : '--'}
        />
      </div>
    </div>
  );
}
