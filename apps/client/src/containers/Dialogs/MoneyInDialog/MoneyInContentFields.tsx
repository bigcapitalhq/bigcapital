// @ts-nocheck
import React from 'react';
import OwnerContributionFormFields from './OwnerContribution/OwnerContributionFormFields';
import OtherIncomeFormFields from './OtherIncome/OtherIncomeFormFields';
import TransferFromAccountFormFields from './TransferFromAccount/TransferFromAccountFormFields';

export default function MoneyInContentFields({ accountType }) {
  const handleTransactionType = () => {
    switch (accountType) {
      case 'owner_contribution':
        return <OwnerContributionFormFields />;

      case 'other_income':
        return <OtherIncomeFormFields />;

      case 'transfer_from_account':
        return <TransferFromAccountFormFields />;
      default:
        break;
    }
  };

  return <React.Fragment>{handleTransactionType()}</React.Fragment>;
}
