// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { useFormikContext } from 'formik';
import { Button, Classes, Intent } from '@blueprintjs/core';
import { DialogsName } from '@/constants/dialogs';
import withDialogActions from '@/containers/Dialog/withDialogActions';

function TaxRateFormDialogFormFooterRoot({ closeDialog }) {
  const { isSubmitting } = useFormikContext();

  const handleClose = () => {
    closeDialog(DialogsName.TaxRateForm);
  };

  return (
    <div className={Classes.DIALOG_FOOTER}>
      <div className={Classes.DIALOG_FOOTER_ACTIONS}>
        <Button
          disabled={isSubmitting}
          onClick={handleClose}
          style={{ minWidth: '75px' }}
        >
          Close
        </Button>

        <Button
          intent={Intent.PRIMARY}
          loading={isSubmitting}
          style={{ minWidth: '95px' }}
          type="submit"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export const TaxRateFormDialogFormFooter = R.compose(withDialogActions)(
  TaxRateFormDialogFormFooterRoot,
);
