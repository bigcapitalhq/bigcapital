import * as FF from 'fp-ts/function';
import React, { lazy } from 'react';
import type { TrackingCategoryFormDialogPayload } from './types';
import type { DialogBaseProps } from '@/components/DialogReduxConnect';
import { Dialog, DialogSuspense, FormattedMessage as T } from '@/components';
import withDialogRedux from '@/components/DialogReduxConnect';

const TrackingCategoryFormDialogContent = lazy(() =>
  import('./TrackingCategoryFormDialogContent').then((m) => ({
    default: m.TrackingCategoryFormDialogContent,
  })),
);

interface TrackingCategoryFormDialogProps extends DialogBaseProps {
  dialogName: string;
  payload: TrackingCategoryFormDialogPayload;
}

/**
 * Tracking category form dialog.
 */
function TrackingCategoryFormDialog({
  dialogName,
  payload: { categoryId = null, action } = {},
  isOpen,
}: TrackingCategoryFormDialogProps): React.ReactElement {
  return (
    <Dialog
      name={dialogName}
      title={
        action === 'edit' ? (
          <T id={'tracking_categories.dialog.label_edit'} />
        ) : (
          <T id={'tracking_categories.dialog.label_new'} />
        )
      }
      isOpen={isOpen}
      canEscapeJeyClose={true}
      autoFocus={true}
      className={'dialog--tracking-category-form'}
    >
      <DialogSuspense testId="tracking-category-form-dialog">
        <TrackingCategoryFormDialogContent
          dialogName={dialogName}
          categoryId={categoryId}
        />
      </DialogSuspense>
    </Dialog>
  );
}

export const index = FF.pipe(TrackingCategoryFormDialog, withDialogRedux());
