import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { EmptyStatus, FormattedMessage as T } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

type TrackingCategoriesEmptyStatusInnerProps = Pick<
  WithDialogActionsProps,
  'openDialog'
>;

function TrackingCategoriesEmptyStatusInner({
  openDialog,
}: TrackingCategoriesEmptyStatusInnerProps) {
  const handleCreateCategory = () => {
    openDialog(DialogsName.TrackingCategoryForm, { action: 'create' });
  };

  return (
    <EmptyStatus
      title={<T id={'tracking_categories.empty_status.title'} />}
      description={
        <p>
          <T id={'tracking_categories.empty_status.description'} />
        </p>
      }
      action={
        <Button
          intent={Intent.PRIMARY}
          large={true}
          onClick={handleCreateCategory}
        >
          <T id={'tracking_categories.action.add'} />
        </Button>
      }
    />
  );
}

export const TrackingCategoriesEmptyStatus = FF.pipe(
  TrackingCategoriesEmptyStatusInner,
  withDialogActions,
);
