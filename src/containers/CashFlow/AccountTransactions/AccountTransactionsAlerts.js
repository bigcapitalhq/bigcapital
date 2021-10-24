import React from 'react';

import AccountDeleteTransactionAlert from '../../Alerts/CashFlow/AccountDeleteTransactionAlert';

/**
 * Account transaction alert.
 */
export default function AccountTransactionsAlerts() {
  return (
    <div>
      <AccountDeleteTransactionAlert name={'account-transaction-delete'} />
    </div>
  );
}
