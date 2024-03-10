// @ts-nocheck
import * as R from 'ramda';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import EstimateMailDialogContent from './EstimateMailDialogContent';
import { DialogsName } from '@/constants/dialogs';

interface EstimateMailDialogBodyProps {
  estimateId: number;
}

function EstimateMailDialogBodyRoot({
  estimateId,

  // #withDialogActions
  closeDialog,
}: EstimateMailDialogBodyProps) {
  const handleSubmit = () => {
    closeDialog(DialogsName.EstimateMail);
  };
  const handleCancelClick = () => {
    closeDialog(DialogsName.EstimateMail);
  };

  return (
    <EstimateMailDialogContent
      estimateId={estimateId}
      onFormSubmit={handleSubmit}
      onCancelClick={handleCancelClick}
    />
  );
}

export default R.compose(withDialogActions)(EstimateMailDialogBodyRoot);
