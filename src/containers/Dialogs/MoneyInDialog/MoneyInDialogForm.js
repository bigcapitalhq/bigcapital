import React from 'react';
import OwnerContributionForm from './OwnerContribution/OwnerContributionForm';
import OtherIncomeForm from './OtherIncome/OtherIncomeForm';
import TransferFromAccountForm from './TransferFromAccount/TransferFromAccountForm';

export default function MoneyInDialogForm({ accountType }) {
  // Handle from transaction.
  const handleFromTransaction = () => {
    switch (accountType) {
      case 'OWNER_CONTRIBUTION':
        return <OwnerContributionForm />;

      case 'OTHER_INCOME':
        return <OtherIncomeForm />;

      case 'TRANSFER_FROM_ACCOUNT':
        return <TransferFromAccountForm />;
      default:
        break;
    }
  };

  return <React.Fragment>{handleFromTransaction()}</React.Fragment>;
}
