// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Money } from '@/components';
import { useContactDetailDrawerContext } from './ContactDetailDrawerProvider';
import { DetailItem } from '@/components/Details';

export default function ContactDetailList({}) {
  const { contact } = useContactDetailDrawerContext();

  return (
    <div className="details-menu">
      <div className="details-menu--vertical">
        <DetailItem
          label={intl.get('display_name')}
          children={contact.display_name}
        />
        <DetailItem
          label={intl.get('balance')}
          children={
            <Money
              amount={contact?.balance}
              currency={contact?.currency_code}
            />
          }
        />
      </div>
      <div className="details-menu--horizontal">
        <DetailItem
          label={intl.get('closing_balance')}
          children={
            <Money
              amount={contact.closing_balance}
              currency={contact?.currency_code}
            />
          }
        />
        <DetailItem
          label={intl.get('contact_type')}
          children={contact.contact_type}
        />
        <DetailItem
          label={intl.get('email')}
          children={contact.email ? contact.email : '--'}
        />
      </div>
    </div>
  );
}
