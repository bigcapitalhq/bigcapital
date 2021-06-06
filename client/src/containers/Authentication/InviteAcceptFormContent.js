import React from 'react';
import { Button, InputGroup, Intent, FormGroup } from '@blueprintjs/core';
import { Form, ErrorMessage, FastField, useFormikContext } from 'formik';
import { Link } from 'react-router-dom';
import { FormattedMessage as T } from 'react-intl';
import { inputIntent } from 'utils';
import { Col, Row } from 'components';
import { useInviteAcceptContext } from './InviteAcceptProvider';
import { PasswordRevealer } from './components';
/**
 * Invite user form.
 */
export default function InviteUserFormContent() {
  // Invite accept context.
  const { inviteMeta } = useInviteAcceptContext();

  // Formik context.
  const { isSubmitting } = useFormikContext();

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
    <Form>
      <Row>
        <Col md={6}>
          <FastField name={'first_name'}>
            {({ form, field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'First Name'} />}
                className={'form-group--first_name'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'first_name'} />}
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
                label={<T id={'Last Name'} />}
                className={'form-group--last_name'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'last_name'} />}
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
            label={<T id={'Phone Number'} />}
            className={'form-group--phone_number'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'phone_number'} />}
          >
            <InputGroup intent={inputIntent({ error, touched })} {...field} />
          </FormGroup>
        )}
      </FastField>

      <FastField name={'password'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'password'} />}
            labelInfo={
              <PasswordRevealer onChange={handlePasswordRevealerChange} />
            }
            className={'form-group--password has-password-revealer'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'password'} />}
          >
            <InputGroup
              lang={true}
              type={passwordType}
              intent={inputIntent({ error, touched })}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>

      <div className={'invite-form__statement-section'}>
        <p>
          <T id={'You email address is'} /> <b>{inviteMeta.email},</b> <br />
          <T id={'you_will_use_this_address_to_sign_in_to_bigcapital'} />
        </p>
        <p>
          <T
            id={'signing_in_or_creating'}
            values={{
              terms: (msg) => <Link>{msg}</Link>,
              privacy: (msg) => <Link>{msg}</Link>,
            }}
          />
        </p>
      </div>

      <div className={'authentication-page__submit-button-wrap'}>
        <Button
          intent={Intent.PRIMARY}
          type="submit"
          fill={true}
          loading={isSubmitting}
        >
          <T id={'create_account'} />
        </Button>
      </div>
    </Form>
  );
}
