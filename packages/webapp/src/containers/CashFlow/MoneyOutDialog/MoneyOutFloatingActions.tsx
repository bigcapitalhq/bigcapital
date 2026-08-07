import { Intent, Button, Classes } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { useMoneyOutDialogContext } from './MoneyOutDialogProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface MoneyOutFloatingActionsInnerProps
  extends Pick<WithDialogActionsProps, 'closeDialog'> {}

/**
 * Money out floating actions.
 */
function MoneyOutFloatingActionsInner({
  closeDialog,
}: MoneyOutFloatingActionsInnerProps) {
  const { isSubmitting, submitForm } = useFormikContext();
  const { dialogName, setSubmitPayload, submitPayload } =
    useMoneyOutDialogContext();

  // Handle submit button click.
  const handleSubmittBtnClick = () => {
    setSubmitPayload({ publish: true });
  };
  // Handle close button click.
  const handleCloseBtnClick = () => {
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

export const MoneyOutFloatingActions = compose(withDialogActions)(
  MoneyOutFloatingActionsInner,
);
