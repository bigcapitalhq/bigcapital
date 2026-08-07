import { useFormikContext } from 'formik';
import { useMemo } from 'react';
import { MoneyOutFieldsProvider } from './MoneyOutFieldsProvider';
import { OtherExpnseFormFields } from './OtherExpense/OtherExpnseFormFields';
import { OwnerDrawingsFormFields } from './OwnerDrawings/OwnerDrawingsFormFields';
import { TransferToAccountFormFields } from './TransferToAccount/TransferToAccountFormFields';
import type { MoneyOutFormValues } from './types';

/**
 * Money out content fields.
 * Switches between form fields based on the given transaction type.
 */
export function MoneyOutContentFields() {
  const { values } = useFormikContext<MoneyOutFormValues>();

  const transactionType = useMemo(() => {
    switch (values.transactionType) {
      case 'owner_drawing':
        return <OwnerDrawingsFormFields />;

      case 'other_expense':
        return <OtherExpnseFormFields />;

      case 'transfer_to_account':
        return <TransferToAccountFormFields />;
      default:
        break;
    }
  }, [values.transactionType]);

  // Cannot continue if transaction type or account is not selected.
  if (!values.transactionType || !values.cashflowAccountId) return null;

  return <MoneyOutFieldsProvider>{transactionType}</MoneyOutFieldsProvider>;
}
