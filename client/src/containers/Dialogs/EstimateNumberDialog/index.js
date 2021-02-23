import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { saveInvoke, compose } from 'utils';

const EstimateNumberDialogContent = lazy(() =>
  import('./EstimateNumberDialogContent'),
);

function EstimateNumberDialog({
  dialogName,
  paylaod = { id: null },
  isOpen,
  onConfirm
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'Estimate_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--journal-number-settings'}
    >
      <DialogSuspense>
        <EstimateNumberDialogContent
          estimateNumberId={paylaod.id}
          onConfirm={(values) => saveInvoke(onConfirm, values)}/>
      </DialogSuspense>
    </Dialog>
  );
}

export default compose(withDialogRedux())(EstimateNumberDialog);
