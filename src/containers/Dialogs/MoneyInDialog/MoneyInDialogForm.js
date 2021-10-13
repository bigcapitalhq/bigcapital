import React from 'react';
import OwnerContributionForm from './OwnerContribution/OwnerContributionForm';
import OtherIncomeForm from './OtherIncome/OtherIncomeForm';

export default function MoneyInDialogForm({ accountType }) {
  // Handle from transaction.
  const handleFromTransaction = () => {
    switch (accountType) {
      case 'OWNERS':
        return <OwnerContributionForm />;

      case 'EQUITY':
        return <OtherIncomeForm />;
      default:
        break;
    }
  };

  return <div>{handleFromTransaction()}</div>;
}
