import React from 'react';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Spinner
} from '@blueprintjs/core';
import { ErrorMessage, FastField, Form } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { Link } from 'react-router-dom';
import { Row, Col, If } from 'components';

import { inputIntent } from 'utils';

/**
 * Register form.
 */
export default function RegisterForm({
  isSubmitting,
}) {
  return (
    <Form className={'authentication-page__form'}>
      <Row className={'name-section'}>
        <Col md={6}>
          <FastField name={'first_name'}>
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
          </FastField>
        </Col>

        <Col md={6}>
          <FastField name={'last_name'}>
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
          </FastField>
        </Col>
      </Row>

      <FastField name={'phone_number'}>
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
      </FastField>
      <FastField name={'email'}>
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
      </FastField>

      <FastField name={'password'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'password'} />}
            // labelInfo={passwordRevealerTmp}
            intent={inputIntent({ error, touched })}
            helperText={
              <ErrorMessage name={'password'} />
            }
            className={'form-group--password has-password-revealer'}
          >
            <InputGroup
              lang={true}
              // type={shown ? 'text' : 'password'}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      <div className={'register-form__agreement-section'}>
        <p>
          <T id={'signing_in_or_creating'} /> <br />
          <Link>
            <T id={'terms_conditions'} />
          </Link>{' '}
          <T id={'and'} />
          <Link>
            {' '}
            <T id={'privacy_statement'} />
          </Link>
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
