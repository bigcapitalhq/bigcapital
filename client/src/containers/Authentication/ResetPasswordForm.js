import React from 'react';
import { Button, InputGroup, Intent, FormGroup } from '@blueprintjs/core';
import { Form, ErrorMessage, FastField } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { inputIntent } from 'utils';

/**
 * Reset password form.
 */
export default function ResetPasswordForm({ isSubmitting }) {
  return (
    <Form>
      <FastField name={'password'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'new_password'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'password'} />}
            className={'form-group--password'}
          >
            <InputGroup
              lang={true}
              type={'password'}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      <FastField name={'confirm_password'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'new_password'} />}
            labelInfo={'(again):'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'confirm_password'} />}
            className={'form-group--confirm-password'}
          >
            <InputGroup
              lang={true}
              type={'password'}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      <div className={'authentication-page__submit-button-wrap'}>
        <Button
          fill={true}
          className={'btn-new'}
          intent={Intent.PRIMARY}
          type="submit"
          loading={isSubmitting}
        >
          <T id={'submit'} />
        </Button>
      </div>
    </Form>
  );
}
