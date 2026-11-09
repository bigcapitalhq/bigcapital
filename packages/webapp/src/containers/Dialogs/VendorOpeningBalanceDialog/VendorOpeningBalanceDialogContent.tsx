import '@/style/pages/VendorOpeningBalance/VendorOpeningBalance.scss';

import { VendorOpeningBalanceForm } from './VendorOpeningBalanceForm';
import { VendorOpeningBalanceFormProvider } from './VendorOpeningBalanceFormProvider';

interface VendorOpeningBalanceDialogContentProps {
  dialogName: string;
  vendorId: number | undefined;
}

/**
 * Vendor Opening balance dialog content.
 */
export function VendorOpeningBalanceDialogContent({
  dialogName,
  vendorId,
}: VendorOpeningBalanceDialogContentProps) {
  return (
    <VendorOpeningBalanceFormProvider
      vendorId={vendorId}
      dialogName={dialogName}
    >
      <VendorOpeningBalanceForm />
    </VendorOpeningBalanceFormProvider>
  );
}
