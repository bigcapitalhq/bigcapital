// @ts-nocheck
import React from 'react';

import OtherExpenseFormFields from './OtherExpense/OtherExpenseFormFields';
import OwnerDrawingsFormFields from './OwnerDrawings/OwnerDrawingsFormFields';
import TransferToAccountFormFields from './TransferToAccount/TransferToAccountFormFields';

function MoneyOutContentFields({ accountType }) {
  const handleTransactionType = () => {
    switch (accountType) {
      case 'OwnerDrawing':
        return <OwnerDrawingsFormFields />;

      case 'other_expense':
        return <OtherExpenseFormFields />;

      case 'transfer_to_account':
        return <TransferToAccountFormFields />;
      default:
        break;
    }
  };
  return <React.Fragment>{handleTransactionType()}</React.Fragment>;
}

export default MoneyOutContentFields;
