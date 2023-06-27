// @ts-nocheck
import React, { useMemo } from 'react';
import { useFormikContext } from 'formik';

import OwnerContributionFormFields from './OwnerContribution/OwnerContributionFormFields';
import OtherIncomeFormFields from './OtherIncome/OtherIncomeFormFields';
import TransferFromAccountFormFields from './TransferFromAccount/TransferFromAccountFormFields';
import { MoneyInFieldsProvider } from './MoneyInFieldsProvider';

/**
 * Money-in dialog content.
 * Switches between fields based on the given transaction type.
 * @returns {JSX.Element}
 */
export default function MoneyInContentFields() {
  const { values } = useFormikContext();

  const transactionFields = useMemo(() => {
    switch (values.transaction_type) {
      case 'owner_contribution':
        return <OwnerContributionFormFields />;

      case 'other_income':
        return <OtherIncomeFormFields />;

      case 'transfer_from_account':
        return <TransferFromAccountFormFields />;
      default:
        break;
    }
  }, [values.transaction_type]);

  // Cannot continue if transaction type or account is not selected.
  if (!values.transaction_type || !values.cashflow_account_id) return null;

  return <MoneyInFieldsProvider>{transactionFields}</MoneyInFieldsProvider>;
}
