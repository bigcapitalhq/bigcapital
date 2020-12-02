import React from 'react';
import {
  FormGroup,
  InputGroup,
  Intent,
  Button,
} from '@blueprintjs/core';
import { FastField, Form, useFormikContext, ErrorMessage } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { inputIntent, saveInvoke } from 'utils';

export default function InviteUserDialogForm({ onCancelClick, action }) {
  const { isSubmitting } = useFormikContext();

  const handleCancelBtnClick = (event) => {
    saveInvoke(onCancelClick, event);
  };

  return (
    <Form>
      <div className={CLASSES.DIALOG_BODY}>
        <p className="mb2">
          <T id={'your_access_to_your_team'} />
        </p>

        <FastField name={'email'}>
          {({ field, meta: { error, touched } }) => (
            <FormGroup
              label={<T id={'email'} />}
              className={classNames('form-group--email', CLASSES.FILL)}
              intent={inputIntent({ error, touched })}
              helperText={<ErrorMessage name="email" />}
              inline={true}
            >
              <InputGroup medium={true} {...field} />
            </FormGroup>
          )}
        </FastField>
    </div>

      <div className={CLASSES.DIALOG_FOOTER}>
        <div className={CLASSES.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={handleCancelBtnClick}>
            <T id={'cancel'} />
          </Button>

          <Button intent={Intent.PRIMARY} type="submit" disabled={isSubmitting}>
            {action === 'edit' ? <T id={'edit'} /> : <T id={'invite'} />}
          </Button>
        </div>
      </div>
    </Form>
  );
}
