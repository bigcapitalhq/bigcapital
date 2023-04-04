// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { InputGroup, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import { Link } from 'react-router-dom';

import { Col, FFormGroup, Row, FormattedMessage as T } from '@/components';
import { useInviteAcceptContext } from './InviteAcceptProvider';
import { PasswordRevealer } from './components';
import { AuthSubmitButton } from './_components';

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
          <FFormGroup name={'first_name'} label={<T id={'first_name'} />}>
            <InputGroup name={'first_name'} />
          </FFormGroup>
        </Col>

        <Col md={6}>
          <FFormGroup name={'last_name'} label={<T id={'last_name'} />}>
            <InputGroup name={'last_name'} />
          </FFormGroup>
        </Col>
      </Row>

      <FFormGroup
        name={'password'}
        label={<T id={'password'} />}
        labelInfo={<PasswordRevealer onChange={handlePasswordRevealerChange} />}
      >
        <InputGroup name={'password'} />
      </FFormGroup>

      <div className={'invite-form__statement-section'}>
        <p>
          <T id={'you_email_address_is'} /> <b>{inviteMeta.email},</b> <br />
          <T id={'you_will_use_this_address_to_sign_in_to_bigcapital'} />
        </p>
        <p>
          {intl.getHTML('signing_in_or_creating', {
            terms: (msg) => <Link>{msg}</Link>,
            privacy: (msg) => <Link>{msg}</Link>,
          })}
        </p>
      </div>

      <AuthSubmitButton
        intent={Intent.PRIMARY}
        type="submit"
        fill={true}
        loading={isSubmitting}
      >
        <T id={'create_account'} />
      </AuthSubmitButton>
    </Form>
  );
}
