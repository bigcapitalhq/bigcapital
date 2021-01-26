import React from 'react';
import { Intent } from '@blueprintjs/core';
import { If, AppToaster } from 'components';
import { formatMessage } from 'services/intl';

export const accountNameAccessor = (account) => {
  return (
    <span>
      <span class={'account-name'}>{account.name}</span>
      <If condition={account.description}>
        <span class={'account-desc'}>{account.description}</span>
      </If>
    </span>
  );
};

// Handle delete errors in bulk and singular.
export const handleDeleteErrors = (errors) => {
  if (errors.find((e) => e.type === 'ACCOUNT.PREDEFINED')) {
    AppToaster.show({
      message: formatMessage({
        id: 'you_could_not_delete_predefined_accounts',
      }),
      intent: Intent.DANGER,
    });
  }
  if (errors.find((e) => e.type === 'ACCOUNT.HAS.ASSOCIATED.TRANSACTIONS')) {
    AppToaster.show({
      message: formatMessage({
        id: 'cannot_delete_account_has_associated_transactions',
      }),
      intent: Intent.DANGER,
    });
  }
};