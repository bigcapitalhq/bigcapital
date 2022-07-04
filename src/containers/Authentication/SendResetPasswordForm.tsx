import React from 'react';
import { Button, InputGroup, Intent, FormGroup } from '@blueprintjs/core';
import { Form, ErrorMessage, FastField } from 'formik';
import { FormattedMessage as T } from '@/components';
import { inputIntent } from 'utils';

/**
 * Send reset password form.
 */
export default function SendResetPasswordForm({ isSubmitting }) {
  return (
    <Form className={'send-reset-password'}>
      <FastField name={'crediential'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'email_or_phone_number'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'crediential'} />}
            className={'form-group--crediential'}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              large={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      <div className={'authentication-page__submit-button-wrap'}>
        <Button
          type={'submit'}
          intent={Intent.PRIMARY}
          fill={true}
          loading={isSubmitting}
        >
          <T id={'send_reset_password_mail'} />
        </Button>
      </div>
    </Form>
  );
}
