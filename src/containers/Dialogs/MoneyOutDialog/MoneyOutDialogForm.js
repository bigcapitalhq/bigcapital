import React from 'react';
import OwnerDrawingsForm from './OwnerDrawings/OwnerDrawingsForm';
import OtherExpenseForm from './OtherExpense/OtherExpenseForm';
import TransferToAccountForm from './TransferToAccount/TransferToAccountForm';

export default function MoneyOutDialogForm({ accountType }) {
  // Handle from transaction.
  const handleFromTransaction = () => {
    switch (accountType) {
      case 'ONWERS_DRAWING':
        return <OwnerDrawingsForm />;

      case 'OTHER_EXPENSE':
        return <OtherExpenseForm />;

      case 'TRANSFER_TO_ACCOUNT':
        return <TransferToAccountForm />;
      default:
        break;
    }
  };

  return <React.Fragment>{handleFromTransaction()}</React.Fragment>;
}
