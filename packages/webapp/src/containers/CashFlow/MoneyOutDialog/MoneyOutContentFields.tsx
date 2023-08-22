// @ts-nocheck
import React, { useMemo } from 'react';
import { useFormikContext } from 'formik';

import OtherExpnseFormFields from './OtherExpense/OtherExpnseFormFields';
import OwnerDrawingsFormFields from './OwnerDrawings/OwnerDrawingsFormFields';
import TransferToAccountFormFields from './TransferToAccount/TransferToAccountFormFields';
import { MoneyOutFieldsProvider } from './MoneyOutFieldsProvider';

/**
 * Money out content fields.
 * Switches between form fields based on the given transaction type.
 * @returns {JSX.Element}
 */
function MoneyOutContentFields() {
  const { values } = useFormikContext();

  const transactionType = useMemo(() => {
    switch (values.transaction_type) {
      case 'OwnerDrawing':
        return <OwnerDrawingsFormFields />;

      case 'other_expense':
        return <OtherExpnseFormFields />;

      case 'transfer_to_account':
        return <TransferToAccountFormFields />;
      default:
        break;
    }
  }, [values.transaction_type]);

  // Cannot continue if transaction type or account is not selected.
  if (!values.transaction_type || !values.cashflow_account_id) return null;

  return <MoneyOutFieldsProvider>{transactionType}</MoneyOutFieldsProvider>;
}

export default MoneyOutContentFields;
