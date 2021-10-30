import React from 'react';

import AccountDeleteTransactionAlert from '../../Alerts/CashFlow/AccountDeleteTransactionAlert';
import ReceiptDeleteAlert from '../../Alerts/Receipts/ReceiptDeleteAlert';
import JournalDeleteAlert from '../../Alerts/ManualJournals/JournalDeleteAlert';
import ExpenseDeleteAlert from '../../Alerts/Expenses/ExpenseDeleteAlert';
import PaymentMadeDeleteAlert from '../../Alerts/PaymentMades/PaymentMadeDeleteAlert';
import PaymentReceiveDeleteAlert from '../../Alerts/PaymentReceives/PaymentReceiveDeleteAlert';

/**
 * Account transaction alert.
 */
export default function AccountTransactionsAlerts() {
  return (
    <div>
      <AccountDeleteTransactionAlert name={'account-transaction-delete'} />
      <ReceiptDeleteAlert name={'receipt-delete'} />
      <JournalDeleteAlert name={'journal-delete'} />
      <ExpenseDeleteAlert name={"expense-delete"} />
      <PaymentMadeDeleteAlert name={'payment-made-delete'} />
      <PaymentReceiveDeleteAlert name={'payment-receive-delete'} />
    </div>
  );
}
