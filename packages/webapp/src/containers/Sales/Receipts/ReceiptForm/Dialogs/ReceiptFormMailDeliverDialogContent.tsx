// @ts-nocheck
import * as R from 'ramda';
import { useHistory } from 'react-router-dom';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import ReceiptMailDialogContent from '../../ReceiptMailDialog/ReceiptMailDialogContent';
import { DialogsName } from '@/constants/dialogs';

interface ReceiptFormDeliverDialogContent {
  receiptId: number;
}

function ReceiptFormDeliverDialogContentRoot({
  receiptId,

  // #withDialogActions
  closeDialog,
}: ReceiptFormDeliverDialogContent) {
  const history = useHistory();

  const handleSubmit = () => {
    history.push('/receipts');
    closeDialog(DialogsName.ReceiptFormMailDeliver);
  };
  const handleCancel = () => {
    history.push('/receipts');
    closeDialog(DialogsName.ReceiptFormMailDeliver);
  };

  return (
    <ReceiptMailDialogContent
      receiptId={receiptId}
      onFormSubmit={handleSubmit}
      onCancelClick={handleCancel}
    />
  );
}

export default R.compose(withDialogActions)(
  ReceiptFormDeliverDialogContentRoot,
);
