// @ts-nocheck
import * as R from 'ramda';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import ReceiptMailDialogContent, {
  ReceiptMailDialogContentProps,
} from './ReceiptMailDialogContent';
import { DialogsName } from '@/constants/dialogs';

interface ReceiptMailDialogBodyProps extends ReceiptMailDialogContentProps {}

function ReceiptMailDialogBodyRoot({
  receiptId,

  // #withDialogActions
  closeDialog,
}: ReceiptMailDialogBodyProps) {
  const handleCancelClick = () => {
    closeDialog(DialogsName.ReceiptMail);
  };
  const handleSubmitClick = () => {
    closeDialog(DialogsName.ReceiptMail);
  };

  return (
    <ReceiptMailDialogContent
      receiptId={receiptId}
      onFormSubmit={handleSubmitClick}
      onCancelClick={handleCancelClick}
    />
  );
}

export default R.compose(withDialogActions)(ReceiptMailDialogBodyRoot);
