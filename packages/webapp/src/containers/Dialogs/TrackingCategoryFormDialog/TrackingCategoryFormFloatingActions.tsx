import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useTrackingCategoryFormContext } from './TrackingCategoryFormProvider';
import type { TrackingCategoryFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

interface TrackingCategoryFormFloatingActionsProps
  extends WithDialogActionsProps {}

function TrackingCategoryFormFloatingActionsInner({
  closeDialog,
}: TrackingCategoryFormFloatingActionsProps): React.ReactElement {
  const { isSubmitting } = useFormikContext<TrackingCategoryFormValues>();
  const { dialogName } = useTrackingCategoryFormContext();

  const handleCancelBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button onClick={handleCancelBtnClick} style={{ minWidth: '85px' }}>
          <T id={'cancel'} />
        </Button>
        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '95px' }}
          type="submit"
        >
          <T id={'save'} />
        </Button>
      </div>
    </div>
  );
}

export const TrackingCategoryFormFloatingActions = FF.pipe(
  TrackingCategoryFormFloatingActionsInner,
  withDialogActions,
);
