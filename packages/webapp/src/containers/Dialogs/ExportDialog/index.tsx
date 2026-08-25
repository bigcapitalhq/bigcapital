import React, { lazy } from 'react';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { compose } from '@/utils';

const ExportDialogContent = lazy(() =>
  import('./ExportDialogContent').then((m) => ({
    default: m.ExportDialogContent,
  })),
);

interface ExportDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: {
    resource?: string | null;
    format?: string | null;
    [key: string]: unknown;
  };
}

// User form dialog.
function ExportDialogRoot({
  dialogName,
  payload,
  isOpen,
}: ExportDialogProps): React.ReactElement {
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
          initialValues={{
            resource: resource ?? undefined,
            format: format ?? undefined,
          }}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const ExportDialog = compose(withDialogRedux())(ExportDialogRoot);
