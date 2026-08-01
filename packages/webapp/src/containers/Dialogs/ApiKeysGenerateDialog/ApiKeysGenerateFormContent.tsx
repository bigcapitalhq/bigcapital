import { Classes, Button, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FFormGroup, FInputGroup, FormattedMessage as T } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

interface ApiKeyFormValues {
  name: string;
}

interface ApiKeysGenerateFormContentProps extends WithDialogActionsProps {
  dialogName: string;
}

/**
 * API Keys Generate form content.
 */
function ApiKeysGenerateFormContentInner({
  dialogName,
  closeDialog,
}: ApiKeysGenerateFormContentProps): React.ReactElement {
  const { isSubmitting } = useFormikContext<ApiKeyFormValues>();

  const handleClose = () => {
    closeDialog(dialogName);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        {/* ----------- Name ----------- */}
        <FFormGroup name={'name'} label={intl.get('api_key.name')}>
          <FInputGroup
            name={'name'}
            placeholder={intl.get('api_key.name_placeholder')}
          />
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

export const ApiKeysGenerateFormContent = compose(withDialogActions)(
  ApiKeysGenerateFormContentInner,
);
