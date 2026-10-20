import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { AppToaster } from '@/components';
import { useDuplicateInvoice } from '@/hooks/query';

/**
 * Duplicates an invoice as a new draft invoice, then opens the duplicate in
 * the invoice form so it can be reviewed and edited.
 */
export const useDuplicateInvoiceAction = () => {
  const history = useHistory();
  const { mutateAsync, isPending } = useDuplicateInvoice();

  /**
   * @param {number} invoiceId - The invoice to duplicate.
   * @param {() => void} onDuplicated - Runs after the duplicate is created and
   *   before navigating to it, e.g. to close the drawer the action came from.
   */
  const duplicateInvoice = (invoiceId: number, onDuplicated?: () => void) =>
    mutateAsync(invoiceId)
      .then(({ id }) => {
        AppToaster.show({
          message: intl.get('the_invoice_has_been_duplicated_successfully'),
          intent: Intent.SUCCESS,
        });
        onDuplicated?.();
        history.push(`/invoices/${id}/edit`);
      })
      .catch((error: Error) => {
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      });

  return { duplicateInvoice, isDuplicating: isPending };
};
