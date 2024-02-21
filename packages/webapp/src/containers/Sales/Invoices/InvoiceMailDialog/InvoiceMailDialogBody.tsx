// @ts-nocheck
import * as R from 'ramda';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import InvoiceMailDialogContent, {
  InvoiceMailDialogContentProps,
} from './InvoiceMailDialogContent';
import { DialogsName } from '@/constants/dialogs';

export interface InvoiceMailDialogBodyProps
  extends InvoiceMailDialogContentProps {}

function InvoiceMailDialogBodyRoot({
  invoiceId,
  onCancelClick,
  onFormSubmit,

  // #withDialogActions
  closeDialog,
}: InvoiceMailDialogBodyProps) {
  const handleCancelClick = () => {
    closeDialog(DialogsName.InvoiceMail);
  };
  const handleSubmitClick = () => {
    closeDialog(DialogsName.InvoiceMail);
  };

  return (
    <InvoiceMailDialogContent
      invoiceId={invoiceId}
      onCancelClick={handleCancelClick}
      onFormSubmit={handleSubmitClick}
    />
  );
}

export default R.compose(withDialogActions)(InvoiceMailDialogBodyRoot);
