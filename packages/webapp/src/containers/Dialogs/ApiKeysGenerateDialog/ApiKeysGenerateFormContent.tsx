// @ts-nocheck
import React from 'react';
import { Form, useFormikContext } from 'formik';
import {
  Classes,
  Button,
  Intent,
} from '@blueprintjs/core';
import { FastField, ErrorMessage } from 'formik';
import {
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import { inputIntent } from '@/utils';
import { FFormGroup, FInputGroup, FormattedMessage as T } from '@/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

/**
 * API Keys Generate form content.
 */
function ApiKeysGenerateFormContent({
  dialogName,
  // #withDialogActions
  closeDialog,
}) {
  const { isSubmitting } = useFormikContext();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        {/* ----------- Name ----------- */}
        <FFormGroup
          name={'name'}
          label={<T id={'name'} />}
        >
          <FInputGroup name={'name'} placeholder="Enter API key name (optional)" />
        </FFormGroup>
      </div>

      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            <T id={'cancel'} />
          </Button>

          <Button
            intent={Intent.PRIMARY}
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            style={{ minWidth: '85px' }}
          >
            <T id={'generate'} />
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(withDialogActions)(ApiKeysGenerateFormContent);
