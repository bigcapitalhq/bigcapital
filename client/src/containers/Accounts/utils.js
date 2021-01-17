import React from 'react';
import { If } from 'components';

export const accountNameAccessor = (account) => {
  return (
    <span>
      <If condition={account.name}>
        <span class={'account-name'}>{ account.name }</span>
      </If>
      <span class={'account-desc'}>{ account.description }</span>
    </span>
  );
}