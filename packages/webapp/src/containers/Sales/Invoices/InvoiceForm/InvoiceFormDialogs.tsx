import { useFormikContext } from 'formik';
import type { InvoiceFormValues } from './utils';
import { DialogsName } from '@/constants/dialogs';
import { index as InvoiceNumberDialog } from '@/containers/Dialogs/InvoiceNumberDialog';
import { InvoiceExchangeRateChangeDialog } from '@/containers/Sales/Invoices/InvoiceForm/Dialogs/InvoiceExchangeRateChangeDialog';

type InvoiceNumberSettings = {
  transactionNumber: string;
  incrementMode: string;
};

/**
 * Invoice form dialogs.
 */
export function InvoiceFormDialogs() {
  const { setFieldValue } = useFormikContext<InvoiceFormValues>();

  // Update the form once the invoice number form submit confirm.
  const handleInvoiceNumberFormConfirm = (settings: InvoiceNumberSettings) => {
    // Set the invoice transaction no. that cames from dialog to the form.
    // the `invoice_no_manually` will be empty except the increment mode is not auto.
    setFieldValue('invoiceNo', settings.transactionNumber);
    setFieldValue('invoiceNoManually', '');

    if (settings.incrementMode !== 'auto') {
      setFieldValue('invoiceNoManually', settings.transactionNumber);
    }
  };

  return (
    <>
      <InvoiceNumberDialog
        dialogName={DialogsName.InvoiceNumberSettings}
        onConfirm={handleInvoiceNumberFormConfirm}
      />
      <InvoiceExchangeRateChangeDialog
        dialogName={DialogsName.InvoiceExchangeRateChangeNotice}
      />
    </>
  );
}
