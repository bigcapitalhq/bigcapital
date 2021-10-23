import React from 'react';

import OtherExpnseFormFields from './OtherExpense/OtherExpnseFormFields';
import OwnerDrawingsFormFields from './OwnerDrawings/OwnerDrawingsFormFields';
import TransferToAccountFormFields from './TransferToAccount/TransferToAccountFormFields';

function MoneyOutContentFields({ accountType }) {
  const handleTransactionType = () => {
    switch (accountType) {
      case 'onwers_drawing':
        return <OwnerDrawingsFormFields />;

      case 'other_expense':
        return <OtherExpnseFormFields />;

      case 'transfer_to_account':
        return <TransferToAccountFormFields />;
      default:
        break;
    }
  };

  return <React.Fragment>{handleTransactionType()}</React.Fragment>;
}

export default MoneyOutContentFields;
