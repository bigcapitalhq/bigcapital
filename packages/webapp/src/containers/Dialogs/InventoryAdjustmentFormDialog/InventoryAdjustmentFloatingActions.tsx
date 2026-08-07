import { Button, Classes, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import type { InventoryAdjustmentFormValues } from './types';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface InventoryAdjustmentFloatingActionsProps
  extends WithDialogActionsProps {}

function InventoryAdjustmentFloatingActionsInner({
  closeDialog,
}: InventoryAdjustmentFloatingActionsProps): React.ReactElement {
  const { isSubmitting, submitForm } =
    useFormikContext<InventoryAdjustmentFormValues>();

  const { dialogName, setSubmitPayload, submitPayload } =
    useInventoryAdjContext();

  const handleSubmitDraftBtnClick = () => {
    setSubmitPayload({ publish: false });
    submitForm();
  };

  const handleSubmitMakeAdjustmentBtnClick = () => {
    setSubmitPayload({ publish: true });
  };

  const handleCloseBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          disabled={isSubmitting}
          onClick={handleCloseBtnClick}
          style={{ minWidth: '75px' }}
        >
          <T id={'close'} />
        </Button>

        <Button
          loading={isSubmitting && !submitPayload.publish}
          style={{ minWidth: '75px' }}
          onClick={handleSubmitDraftBtnClick}
        >
          <T id={'save_as_draft'} />
        </Button>

        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting && submitPayload.publish}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmitMakeAdjustmentBtnClick}
        >
          <T id={'make_adjustment'} />
        </Button>
      </div>
    </div>
  );
}

export const InventoryAdjustmentFloatingActions = compose(withDialogActions)(
  InventoryAdjustmentFloatingActionsInner,
);
