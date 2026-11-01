import '@/style/pages/CustomerOpeningBalance/CustomerOpeningBalance.scss';

import { CustomerOpeningBalanceForm } from './CustomerOpeningBalanceForm';
import { CustomerOpeningBalanceFormProvider } from './CustomerOpeningBalanceFormProvider';

interface CustomerOpeningBalanceDialogContentProps {
  dialogName: string;
  customerId: number | undefined;
}

/**
 * Customer opening balance dialog content.
 */
export function CustomerOpeningBalanceDialogContent({
  dialogName,
  customerId,
}: CustomerOpeningBalanceDialogContentProps) {
  return (
    <CustomerOpeningBalanceFormProvider
      customerId={customerId}
      dialogName={dialogName}
    >
      <CustomerOpeningBalanceForm />
    </CustomerOpeningBalanceFormProvider>
  );
}
