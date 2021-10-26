import React from 'react';

import AccountDeleteTransactionAlert from '../../Alerts/CashFlow/AccountDeleteTransactionAlert';
import ReceiptsAlerts from '../../Sales/Receipts/ReceiptsAlerts';
import ManualJournalsAlerts from '../../Accounting/JournalsLanding/ManualJournalsAlerts';
import ExpensesAlerts from '../../Expenses/ExpensesAlerts';
import PaymentReceiveAlerts from '../../Sales/PaymentReceives/PaymentReceiveAlerts';
import PaymentMadesAlerts from '../../Purchases/PaymentMades/PaymentMadesAlerts';

/**
 * Account transaction alert.
 */
export default function AccountTransactionsAlerts() {
  return (
    <div>
      <AccountDeleteTransactionAlert name={'account-transaction-delete'} />
      <ReceiptsAlerts />
      <ExpensesAlerts />
      <ManualJournalsAlerts />
      <PaymentReceiveAlerts />
      <PaymentMadesAlerts />
    </div>
  );
}
