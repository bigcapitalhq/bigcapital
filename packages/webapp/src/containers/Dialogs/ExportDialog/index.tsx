// @ts-nocheck
import React, { lazy } from 'react';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ExportDialogContent = lazy(() => import('./ExportDialogContent'));

// User form dialog.
function ExportDialogRoot({ dialogName, payload, isOpen }) {
  const { resource = null, format = null } = payload;

  return (
    <Dialog
      name={dialogName}
      title={'Export Data'}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
    >
      <DialogSuspense>
        <ExportDialogContent
          dialogName={dialogName}
          initialValues={{ resource, format }}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const ExportDialog = compose(withDialogRedux())(ExportDialogRoot);
