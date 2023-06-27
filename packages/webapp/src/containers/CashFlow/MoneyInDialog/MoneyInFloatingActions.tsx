// @ts-nocheck
import React from 'react';
import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useMoneyInDialogContext } from './MoneyInDialogProvider';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * Money in floating actions.
 */
function MoneyInFloatingActions({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting, submitForm } = useFormikContext();
  //  money in  dialog context.
  const { dialogName, setSubmitPayload, submitPayload } =
    useMoneyInDialogContext();

  // handle submit as draft button click.
  const handleSubmitDraftBtnClick = (event) => {
    setSubmitPayload({ publish: false });
    submitForm();
  };
  // Handle submit  button click.
  const handleSubmitBtnClick = (event) => {
    setSubmitPayload({ publish: true });
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
        {/* <Button
          disabled={isSubmitting}
          loading={isSubmitting && !submitPayload.publish}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmitDraftBtnClick}
        >
          {<T id={'save_as_draft'} />}
        </Button> */}

        <Button
          intent={Intent.PRIMARY}
          disabled={isSubmitting}
          loading={isSubmitting && submitPayload.publish}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmitBtnClick}
        >
          {<T id={'save_and_publish'} />}
        </Button>
      </div>
    </div>
  );
}

export default compose(withDialogActions)(MoneyInFloatingActions);
