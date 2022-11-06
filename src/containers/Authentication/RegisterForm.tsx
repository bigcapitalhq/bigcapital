// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Spinner,
} from '@blueprintjs/core';
import { ErrorMessage, Field, Form } from 'formik';
import { FormattedMessage as T } from '@/components';
import { Link } from 'react-router-dom';
import { Row, Col, If } from '@/components';
import { PasswordRevealer } from './components';
import { inputIntent } from '@/utils';

/**
 * Register form.
 */
export default function RegisterForm({ isSubmitting }) {
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
      <Row className={'name-section'}>
        <Col md={6}>
          <Field name={'first_name'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'first_name'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'first_name'} />}
                className={'form-group--first-name'}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </Field>
        </Col>

        <Col md={6}>
          <Field name={'last_name'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'last_name'} />}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'last_name'} />}
                className={'form-group--last-name'}
              >
                <InputGroup
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>

      <Field name={'phone_number'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'phone_number'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'phone_number'} />}
            className={'form-group--phone-number'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </Field>

      <Field name={'email'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'email'} />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'email'} />}
            className={'form-group--email'}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
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
              lang={true}
              type={passwordType}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </Field>

      <div className={'register-form__agreement-section'}>
        <p>
          {intl.getHTML('signing_in_or_creating', {
            terms: (msg) => <Link>{msg}</Link>,
            privacy: (msg) => <Link>{msg}</Link>,
          })}
        </p>
      </div>

      <div className={'authentication-page__submit-button-wrap'}>
        <Button
          className={'btn-register'}
          intent={Intent.PRIMARY}
          type="submit"
          fill={true}
          loading={isSubmitting}
        >
          <T id={'register'} />
        </Button>
      </div>

      <If condition={isSubmitting}>
        <div class="authentication-page__loading-overlay">
          <Spinner size={50} />
        </div>
      </If>
    </Form>
  );
}
