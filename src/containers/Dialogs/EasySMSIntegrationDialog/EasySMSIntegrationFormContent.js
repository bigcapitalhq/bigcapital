import React from 'react';
import { Form, FastField, ErrorMessage, useFormikContext } from 'formik';
import { Classes, FormGroup, InputGroup, Button } from '@blueprintjs/core';
import { FieldRequiredHint, FormattedMessage as T } from 'components';
import { useEasySMSIntegration } from './EasySMSIntegrationProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { inputIntent, compose } from 'utils';

/**
 * EasySMS Integration form content.
 */
function EasySMSIntegrationFormContent({
  // #withDialogActions
  closeDialog,
}) {
  // Formik context.
  const { isSubmitting } = useFormikContext();

  // EasySMS Integration dialog context.
  const { dialogName } = useEasySMSIntegration();

  // Handle close button click.
  const handleCloseBtnClick = () => {
    closeDialog(dialogName);
  };

  return (
    <Form>
      <div className={Classes.DIALOG_BODY}>
        {/*------------ Token -----------*/}
        <FastField name={'token'}>
          {({ form, field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'easysms.integrate.dialog.label.token'} />}
              labelInfo={<FieldRequiredHint />}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="token" />}
              className={'form-group--token'}
            >
              <InputGroup intent={inputIntent({ error, touched })} {...field} />
            </FormGroup>
          )}
        </FastField>
      </div>
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
            loading={isSubmitting}
            style={{ minWidth: '75px' }}
            type="submit"
          >
            {<T id={'save'} />}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default compose(withDialogActions)(EasySMSIntegrationFormContent);
