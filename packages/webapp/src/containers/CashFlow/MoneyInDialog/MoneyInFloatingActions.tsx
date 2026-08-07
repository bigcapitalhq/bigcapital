import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useMoneyInDailogContext } from './MoneyInDialogProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface MoneyInFloatingActionsInnerProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {}

/**
 * Money in floating actions.
 */
function MoneyInFloatingActionsInner({
  closeDialog,
}: MoneyInFloatingActionsInnerProps) {
  const { isSubmitting, submitForm } = useFormikContext();
  const { dialogName, setSubmitPayload, submitPayload } =
    useMoneyInDailogContext();

  // handle submit as draft button click.
  const handleSubmitDraftBtnClick = (_event: React.MouseEvent) => {
    setSubmitPayload({ publish: false });
    submitForm();
  };
  // Handle submit button click.
  const handleSubmittBtnClick = (_event: React.MouseEvent) => {
    setSubmitPayload({ publish: true });
  };
  // Handle close button click.
  const handleCloseBtnClick = (_event: React.MouseEvent) => {
    if (dialogName) closeDialog(dialogName);
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
          intent={Intent.PRIMARY}
          disabled={isSubmitting}
          loading={isSubmitting && submitPayload.publish}
          style={{ minWidth: '75px' }}
          type="submit"
          onClick={handleSubmittBtnClick}
        >
          {<T id={'save_and_publish'} />}
        </Button>
      </div>
    </div>
  );
}

export const MoneyInFloatingActions = compose(withDialogActions)(
  MoneyInFloatingActionsInner,
);
