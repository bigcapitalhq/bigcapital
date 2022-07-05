import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useInventoryAdjContext } from './InventoryAdjustmentFormProvider';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Inventory adjustment floating actions.
 */
function InventoryAdjustmentFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting, submitForm } = useFormikContext();

  // Inventory adjustment dialog context.
  const { dialogName, setSubmitPayload, submitPayload } =
    useInventoryAdjContext();

  // handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ publish: false });
    submitForm();
  };

  // Handle submit make adjustment button click.
  const handleSubmitMakeAdjustmentBtnClick = (event) => {
    setSubmitPayload({ publish: true });
    submitForm();
  };

  // Handle close button click.
  const handleCloseBtnClick = (event) => {
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
          type="submit"
          onClick={handleSubmitDraftBtnClick}
        >
          {<T id={'save_as_draft'} />}
        </Button>

        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting && submitPayload.publish}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmitMakeAdjustmentBtnClick}
        >
          {<T id={'make_adjustment'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(InventoryAdjustmentFloatingActions);
