import React from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Icon, Money } from 'components';

/**
 *  Account drawer header.
 */
export default function AccountDrawerHeader({
  account: {
    account_normal,
    account_type_label,
    code,
    amount,
    currency_code,
    description,
  },
}) {
  return (
    <div className={'account-drawer__content'}>
      <div>
        <span>Closing Balance</span>
        <p className={'balance'}>
          {<Money amount={amount} currency={currency_code} />}
        </p>
      </div>
      <div class={'account-type'}>
        <span>
          <T id={'account_type'} />
        </span>
        <p>{account_type_label}</p>
      </div>
      <div class={'account-normal'}>
        <span>
          <T id={'account_normal'} />
        </span>
        <p>
          {' '}
          {account_normal}{' '}
          <Icon
            iconSize={14}
            icon={`arrow-${account_normal === 'credit' ? 'down' : 'up'}`}
          />
        </p>
      </div>
      <div>
        <span>
          <T id={'code'} />
        </span>
        <p>{code}</p>
      </div>
      <div>
        <span>
          <T id={'currency'} />
        </span>
        <p>{currency_code}</p>
      </div>

      <p className={'account-drawer__content--desc'}>
        <b>
          <T id={'description'} />
        </b>
        : {description ? description : '--'}
      </p>
    </div>
  );
}
