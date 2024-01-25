// @ts-nocheck
import * as R from 'ramda';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { useHistory } from 'react-router-dom';
import EstimateMailDialogContent from '../../EstimateMailDialog/EstimateMailDialogContent';
import { DialogsName } from '@/constants/dialogs';

interface EstimateFormDeliverDialogContent {
  estimateId: number;
}

function EstimateFormDeliverDialogContentRoot({
  estimateId,

  // #withDialogActions
  closeDialog,
}: EstimateFormDeliverDialogContent) {
  const history = useHistory();

  const handleSubmit = () => {
    closeDialog(DialogsName.EstimateFormMailDeliver);
    history.push('/estimates');
  };
  const handleCancel = () => {
    closeDialog(DialogsName.EstimateFormMailDeliver);
    history.push('/estimates');
  };

  return (
    <EstimateMailDialogContent
      estimateId={estimateId}
      onFormSubmit={handleSubmit}
      onCancelClick={handleCancel}
    />
  );
}

export default R.compose(withDialogActions)(
  EstimateFormDeliverDialogContentRoot,
);
