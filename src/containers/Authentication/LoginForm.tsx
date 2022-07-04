import React from 'react';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Checkbox,
} from '@blueprintjs/core';
import { Form, ErrorMessage, Field } from 'formik';
import { T } from '@/components';
import { inputIntent } from 'utils';
import { PasswordRevealer } from './components';

/**
 * Login form.
 */
export default function LoginForm({ isSubmitting }) {
  const [passwordType, setPasswordType] = React.useState('password');

  // Handle password revealer changing.
  const handlePasswordRevealerChange = React.useCallback(
    (shown) => {
      const type = shown ? 'text' : 'password';
      setPasswordType(type);
    },
    [setPasswordType],
  );

  return (
    <Form className={'authentication-page__form'}>
      <Field name={'crediential'}>
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
      </Field>

      <Field name={'password'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'password'} />}
            labelInfo={
              <PasswordRevealer onChange={handlePasswordRevealerChange} />
            }
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'password'} />}
            className={'form-group--password has-password-revealer'}
          >
            <InputGroup
              large={true}
              intent={inputIntent({ error, touched })}
              type={passwordType}
              {...field}
            />
          </FormGroup>
        )}
      </Field>

      <div className={'login-form__checkbox-section'}>
        <Checkbox large={true} className={'checkbox--remember-me'}>
          <T id={'keep_me_logged_in'} />
        </Checkbox>
      </div>

      <div className={'authentication-page__submit-button-wrap'}>
        <Button
          type={'submit'}
          intent={Intent.PRIMARY}
          fill={true}
          lang={true}
          loading={isSubmitting}
        >
          <T id={'log_in'} />
        </Button>
      </div>
    </Form>
  );
}
