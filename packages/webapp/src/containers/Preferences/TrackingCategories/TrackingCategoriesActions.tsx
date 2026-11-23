import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T, Icon } from '@/components';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

type TrackingCategoriesActionsInnerProps = Pick<
  WithDialogActionsProps,
  'openDialog'
>;

function TrackingCategoriesActionsInner({
  openDialog,
}: TrackingCategoriesActionsInnerProps) {
  const handleCreateCategory = () => {
    openDialog(DialogsName.TrackingCategoryForm, { action: 'create' });
  };

  return (
    <Button
      icon={<Icon icon="plus" iconSize={12} />}
      onClick={handleCreateCategory}
      intent={Intent.PRIMARY}
    >
      <T id={'tracking_categories.action.add'} />
    </Button>
  );
}

export const TrackingCategoriesActions = FF.pipe(
  TrackingCategoriesActionsInner,
  withDialogActions,
);
