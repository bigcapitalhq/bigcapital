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
import intl from 'react-intl-universal';
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
          label={<T id={'api_key.name'} />}
        >
          <FInputGroup name={'name'} placeholder={intl.get('api_key.name_placeholder')} />
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
            style={{ minWidth: '100px' }}
          >
            <T id={'api_key.generate'} />
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(withDialogActions)(ApiKeysGenerateFormContent);
