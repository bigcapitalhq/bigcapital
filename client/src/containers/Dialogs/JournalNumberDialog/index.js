import React, { lazy } from 'react';
import { FormattedMessage as T } from 'react-intl';
import { Dialog, DialogSuspense } from 'components';
import withDialogRedux from 'components/DialogReduxConnect';
import { compose } from 'utils';

const JournalNumberDialogContent = lazy(() => import('./JournalNumberDialogContent'));

function JournalNumberDialog({
  dialogName,
  payload = { id: null },
  isOpen,
}) {
  return (
    <Dialog
      name={dialogName}
      title={<T id={'journal_number_settings'} />}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      className={'dialog--journal-number-settings'}
    >
      <DialogSuspense>
        <JournalNumberDialogContent
          journalNumberId={payload.id}
        />
      </DialogSuspense>
    </Dialog>
  );
}


export default compose(
  withDialogRedux(),
)(JournalNumberDialog);
