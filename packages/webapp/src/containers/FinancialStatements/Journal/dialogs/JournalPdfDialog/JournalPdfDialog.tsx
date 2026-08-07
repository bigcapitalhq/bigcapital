import classNames from 'classnames';
import React, { lazy } from 'react';
import { Dialog, DialogSuspense } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';
import { CLASSES } from '@/constants/classes';
import { compose } from '@/utils';

// Lazy loading the content.
const JournalPdfDialogContent = lazy(() =>
  import('./JournalPdfDialogContent').then((m) => ({
    default: m.JournalPdfDialogContent,
  })),
);

interface JournalPdfDialogRootProps {
  dialogName: string;
  payload?: Record<string, unknown>;
  isOpen: boolean;
}

/**
 * Journal sheet pdf preview dialog.
 * @returns {React.ReactNode}
 */
function JournalPdfDialogRoot({
  dialogName,
  payload,
  isOpen,
}: JournalPdfDialogRootProps) {
  return (
    <Dialog
      name={dialogName}
      title={'Journal Print Preview'}
      className={classNames(CLASSES.DIALOG_PDF_PREVIEW)}
      autoFocus={true}
      canEscapeKeyClose={true}
      isOpen={isOpen}
      style={{ width: '1000px' }}
    >
      <DialogSuspense>
        <JournalPdfDialogContent dialogName={dialogName} />
      </DialogSuspense>
    </Dialog>
  );
}

export const JournalPdfDialog =
  compose(withDialogRedux())(JournalPdfDialogRoot);
